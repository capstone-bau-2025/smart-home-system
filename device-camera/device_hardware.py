# device_hardware.py
import cv2
from flask import Flask, Response, render_template_string
import threading
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("CameraStream")

app = Flask(__name__)
camera = None
camera_lock = threading.Lock()
camera_active = False
flask_thread = None

# State variables
auto_shutdown_duration = 5  # Default auto-shutdown duration in minutes
auto_shutdown_timer = None

def init_camera():
    """Initialize the camera"""
    global camera
    with camera_lock:
        if camera is None:
            logger.info("Initializing camera hardware")
            camera = cv2.VideoCapture(0)  # 0 is usually the default camera
        return camera is not None

def release_camera():
    """Release camera resources"""
    global camera
    with camera_lock:
        if camera is not None:
            logger.info("Releasing camera hardware")
            camera.release()
            camera = None

def generate_frames():
    """Generate video frames"""
    global camera, camera_active
    
    if not init_camera():
        logger.error("Failed to initialize camera")
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n'
               b'\r\n\r\n')
        return
    
    while camera_active:
        with camera_lock:
            success, frame = camera.read()
            
        if not success:
            logger.warning("Failed to read frame from camera")
            break
            
        _, buffer = cv2.imencode('.jpg', frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

@app.route('/video')
def video():
    """Stream video feed"""
    global camera_active
    if not camera_active:
        # If camera is not active, return a placeholder or error message
        return "Camera is currently OFF", 503
        
    return Response(generate_frames(), 
                   mimetype='multipart/x-mixed-replace; boundary=frame')

def start_auto_shutdown_timer(publish_event_callback=None):
    """Start auto-shutdown timer for the camera"""
    global auto_shutdown_timer, auto_shutdown_duration, camera_active
    
    # Cancel existing timer if any
    if auto_shutdown_timer:
        auto_shutdown_timer.cancel()
    
    # Convert minutes to seconds for the timer
    seconds = auto_shutdown_duration * 60
    
    # Define the shutdown function
    def auto_shutdown():
        global camera_active
        logger.info(f"Auto-shutdown triggered after {auto_shutdown_duration} minutes")
        set_camera_state("OFF")
        # Notify about auto-shutdown event if callback provided
        if publish_event_callback:
            publish_event_callback(2)  # Event number 2 is AUTO_SHUTDOWN
    
    # Only set the timer if camera is active
    if camera_active:
        logger.info(f"Setting auto-shutdown timer for {auto_shutdown_duration} minutes ({seconds} seconds)")
        auto_shutdown_timer = threading.Timer(seconds, auto_shutdown)
        auto_shutdown_timer.daemon = True
        auto_shutdown_timer.start()

def set_camera_state(state, publish_event_callback=None, publish_state_callback=None):
    """Set camera active state"""
    global camera_active, auto_shutdown_timer
    logger.info(f"Setting camera state to: {state}")
    
    camera_active = state == "ON"
    if camera_active:
        init_camera()
        # Start auto-shutdown timer when camera is turned on
        start_auto_shutdown_timer(publish_event_callback)
    else:
        # Cancel auto-shutdown timer when camera is turned off
        if auto_shutdown_timer:
            auto_shutdown_timer.cancel()
            auto_shutdown_timer = None
        release_camera()
    
    # Notify hub about state change if callback provided
    if publish_state_callback:
        publish_state_callback(1, state)
    
    return camera_active

def set_auto_shutdown_duration(duration, publish_state_callback=None):
    """Set the auto-shutdown duration in minutes"""
    global auto_shutdown_duration
    
    if isinstance(duration, int) and 5 <= duration <= 120:  # Accept 1-60 minutes
        logger.info(f"Setting auto-shutdown duration to {duration} minutes")
        auto_shutdown_duration = duration
        # Restart timer with new duration if camera is active
        if camera_active:
            start_auto_shutdown_timer()
        
        # Notify hub about state change if callback provided
        if publish_state_callback:
            publish_state_callback(2, str(duration))
            
        return True
    else:
        logger.error(f"Invalid auto-shutdown duration: {duration} minutes")
        return False

def get_camera_state():
    """Get current camera state"""
    global camera_active
    return "ON" if camera_active else "OFF"

def get_auto_shutdown_duration():
    """Get current auto-shutdown duration in minutes"""
    global auto_shutdown_duration
    return str(auto_shutdown_duration)

def start_stream():
    """Start the Flask server for streaming"""
    global flask_thread
    if flask_thread is None:
        flask_thread = threading.Thread(target=lambda: app.run(host='0.0.0.0', port=8000, threaded=True))
        flask_thread.daemon = True
        flask_thread.start()
        logger.info("Stream server started on port 8000")

if __name__ == '__main__':
    camera_active = True  # Default to active when running standalone
    start_stream()
