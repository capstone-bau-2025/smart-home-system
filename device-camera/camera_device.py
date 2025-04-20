import logging
import threading
import socket
from device_config import get_device_config
from mqtt_client import MqttClient
from message_handlers import handle_ping, handle_get_state, handle_set_state, handle_command, handle_get_streaming_link

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DeviceTemplate")

# Extend MqttClient with IP address getter method
class CameraClient(MqttClient):
    def get_ip_address(self):
        """Get the local IP address of this device"""
        try:
            # Create a socket connection to an external server to determine our IP
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))  # Google's public DNS
            ip = s.getsockname()[0]
            s.close()
            return ip
        except Exception as e:
            logger.error(f"Error getting IP address: {e}")
            return "localhost"  # Fallback

def start_camera_stream(camera_device):
    """Start the camera stream in a separate thread"""
    from device_hardware import start_stream
    stream_thread = threading.Thread(target=start_stream)
    stream_thread.daemon = True
    stream_thread.start()
    logger.info("Camera stream started")

def main():
    # Get device configuration
    device_config = get_device_config()

    # Create MQTT device using extended class with IP address method
    device = CameraClient(device_config)

    # Register message handlers
    device.register_handler("PING", handle_ping)
    device.register_handler("GET_STATE", handle_get_state)
    device.register_handler("SET_STATE", handle_set_state)
    device.register_handler("COMMAND", handle_command)
    device.register_handler("GET_STREAMING_LINK", handle_get_streaming_link)

    # Initialize camera stream
    start_camera_stream(device)

    # Publish device started event when the device starts
    device.start()
    device.publish_event(1)  # DEVICE_STARTED event

if __name__ == "__main__":
    main()
