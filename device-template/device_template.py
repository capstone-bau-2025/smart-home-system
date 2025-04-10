# device_template.py
import logging
from device_config import get_device_config
from mqtt_client import MqttClient
from message_handlers import handle_ping, handle_get_state, handle_set_state, handle_command

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("DeviceTemplate")

def main():
    # Get device configuration
    device_config = get_device_config()

    # Create MQTT device
    device = MqttClient(device_config)

    # Register message handlers
    device.register_handler("PING", handle_ping)
    device.register_handler("GET_STATE", handle_get_state)
    device.register_handler("SET_STATE", handle_set_state)
    device.register_handler("COMMAND", handle_command)

    # Start the device
    device.start()

if __name__ == "__main__":
    main()