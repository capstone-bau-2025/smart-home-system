# camera_device.py
import cv2
import socket
import threading
import random
from datetime import datetime
from flask import Flask, Response
from device_base import Device

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Camera state
        self.camera_active = False
        self.camera = None
        self.camera_lock = threading.Lock()

        # Flask application for video streaming
        self.app = Flask(__name__)
        self.setup_routes()
        self.flask_thread = None

        # State variables
        self.auto_shutdown_duration = 5  # Default auto-shutdown duration in minutes
        self.auto_shutdown_timer = None

    def _on_paired(self):
        """Override - Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()
        # Publish device started event
        self.publish_event(1)  # DEVICE_STARTED event

    def setup_routes(self):
        """Setup Flask routes for video streaming"""
        @self.app.route('/video')
        def video():
            if not self.camera_active:
                return "Camera is currently OFF", 503
            return Response(self.generate_frames(),
                            mimetype='multipart/x-mixed-replace; boundary=frame')

    def get_ip_address(self):
        """Get the IP address of this device for streaming URL"""
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception as e:
            self.logger.error(f"Error getting IP address: {e}")
            return "localhost"

    def _start_device(self):
        """Start the camera server"""
        if self.flask_thread is None or not self.flask_thread.is_alive():
            self.flask_thread = threading.Thread(
                target=lambda: self.app.run(host='0.0.0.0', port=8000, threaded=True)
            )
            self.flask_thread.daemon = True
            self.flask_thread.start()
            self.logger.info("Camera stream server started on port 8000")

    def _stop_device(self):
        """Stop camera and release resources"""
        self.set_camera_state("OFF")
        # Flask server will stop when the process ends

    def init_camera(self):
        """Initialize the camera hardware"""
        with self.camera_lock:
            if self.camera is None:
                self.logger.info("Initializing camera hardware")
                self.camera = cv2.VideoCapture(0)  # 0 is usually the default camera
            return self.camera is not None

    def release_camera(self):
        """Release camera resources"""
        with self.camera_lock:
            if self.camera is not None:
                self.logger.info("Releasing camera hardware")
                self.camera.release()
                self.camera = None

    def generate_frames(self):
        """Generate video frames for streaming"""
        if not self.init_camera():
            self.logger.error("Failed to initialize camera")
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n'
                   b'\r\n\r\n')
            return

        while self.camera_active:
            with self.camera_lock:
                success, frame = self.camera.read()

            if not success:
                self.logger.warning("Failed to read frame from camera")
                break

            _, buffer = cv2.imencode('.jpg', frame)
            frame_bytes = buffer.tobytes()

            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

    def start_auto_shutdown_timer(self):
        """Start auto-shutdown timer for the camera"""
        # Cancel existing timer if any
        if self.auto_shutdown_timer:
            self.auto_shutdown_timer.cancel()

        # Convert minutes to seconds for the timer
        seconds = self.auto_shutdown_duration * 60

        # Define the shutdown function
        def auto_shutdown():
            self.logger.info(f"Auto-shutdown triggered after {self.auto_shutdown_duration} minutes")
            self.set_camera_state("OFF")
            # Notify about auto-shutdown event
            self.publish_event(2)  # Event number 2 is AUTO_SHUTDOWN

        # Only set the timer if camera is active
        if self.camera_active:
            self.logger.info(f"Setting auto-shutdown timer for {self.auto_shutdown_duration} minutes")
            self.auto_shutdown_timer = threading.Timer(seconds, auto_shutdown)
            self.auto_shutdown_timer.daemon = True
            self.auto_shutdown_timer.start()

    def set_camera_state(self, state):
        """Set camera active state"""
        self.logger.info(f"Setting camera state to: {state}")

        self.camera_active = state == "ON"
        if self.camera_active:
            self.init_camera()
            # Start auto-shutdown timer when camera is turned on
            self.start_auto_shutdown_timer()
        else:
            # Cancel auto-shutdown timer when camera is turned off
            if self.auto_shutdown_timer:
                self.auto_shutdown_timer.cancel()
                self.auto_shutdown_timer = None
            self.release_camera()

        # Notify hub about state change
        if self.paired:
            self.publish_state_update(1, state)

        return self.camera_active

    def set_auto_shutdown_duration(self, duration):
        """Set the auto-shutdown duration in minutes"""
        try:
            duration = int(duration)
            if 5 <= duration <= 120:  # Accept 5-120 minutes
                self.logger.info(f"Setting auto-shutdown duration to {duration} minutes")
                self.auto_shutdown_duration = duration
                # Restart timer with new duration if camera is active
                if self.camera_active:
                    self.start_auto_shutdown_timer()

                # Notify hub about state change
                if self.paired:
                    self.publish_state_update(2, str(duration))

                return True
            else:
                self.logger.error(f"Invalid auto-shutdown duration: {duration} minutes")
                return False
        except ValueError:
            self.logger.error(f"Invalid auto-shutdown duration value: {duration}")
            return False

    # Message handlers implementation
    def handle_ping(self, message):
        """Handle PING message from hub"""
        message_id = message.get("message_id")

        response = {
            "message_id": message_id,
            "message_type": "PING",
            "status": "SUCCESS",
            "uid": self.device_uid,
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)
        self.logger.info(f"Responded to PING message with ID: {message_id}")

    def handle_get_state(self, message):
        """Handle GET_STATE message from hub"""
        message_id = message.get("message_id")
        state_number = message.get("state_number")

        # Get the actual state value
        if state_number == 1:
            state_value = "ON" if self.camera_active else "OFF"
        elif state_number == 2:
            state_value = str(self.auto_shutdown_duration)
        else:
            state_value = "unknown"

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "state_number": state_number,
            "value": state_value,
            "status": "SUCCESS",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)
        self.logger.info(f"Responded to GET_STATE for state {state_number} with value: {state_value}")

    def handle_set_state(self, message):
        """Handle SET_STATE message from hub"""
        message_id = message.get("message_id")
        state_number = message.get("state_number")
        value = message.get("value")

        success = False

        try:
            if state_number == 1:  # Camera status
                if value in ["ON", "OFF"]:
                    success = self.set_camera_state(value)
                else:
                    self.logger.error(f"Invalid status value: {value}. Must be 'ON' or 'OFF'")

            elif state_number == 2:  # Auto-shutdown duration
                success = self.set_auto_shutdown_duration(value)
            else:
                self.logger.error(f"Unknown state number: {state_number}")

        except Exception as e:
            self.logger.error(f"Error setting state: {e}")

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "status": "SUCCESS" if success else "FAILURE",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)

    def handle_command(self, message):
        """Handle COMMAND message from hub"""
        message_id = message.get("message_id")
        command_number = message.get("command_number")

        success = False

        if command_number == 1:  # RESTART
            self.logger.info("Executing restart command")
            # First turn off the camera
            self.set_camera_state("OFF")
            # Then turn it back on
            success = self.set_camera_state("ON")
        else:
            self.logger.warning(f"Unknown command number: {command_number}")

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "status": "SUCCESS" if success else "FAILURE",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)

    def handle_get_streaming_link(self, message):
        """Handle GET_STREAMING_LINK message from hub"""
        message_id = message.get("message_id")

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "uid": self.device_uid,
            "streaming_link": f"http://{self.get_ip_address()}:8000/video",
            "status": "SUCCESS" if self.camera_active else "FAILURE",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)
        self.logger.info(f"Responded to GET_STREAMING_LINK message with ID: {message_id}")

def get_device_config():
    uid = random.randint(1000, 9999)

    return {
        "uid": uid,
        "model": "Camera_Model_Z1",
        "description": "Streaming camera with auto-shutdown feature",
        "type": "CAMERA",
        "support_streaming": True,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "status",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            },
            {
                "number": 2,
                "is_mutable": True,
                "name": "duration",
                "type": "RANGE",
                "min_range": 5,
                "max_range": 120
            }
        ],
        "commands": [
            {
                "number": 1,
                "name": "RESTART",
                "description": "Restart camera device"
            }
        ],
        "events": [
            {
                "number": 1,
                "name": "DEVICE_STARTED",
                "description": "Device has started or restarted"
            },
            {
                "number": 2,
                "name": "AUTO_SHUTDOWN",
                "description": "Camera turned off automatically after duration elapsed"
            }
        ]
    }