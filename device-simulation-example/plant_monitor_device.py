# plant_monitor_device.py
import logging
import time
import threading
from device_config import get_device_config
from device_hardware import PlantHardware
from mqtt_client import MqttClient
from message_handlers import handle_ping, handle_get_state, handle_set_state, handle_command

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("PlantMonitorDevice")

def main():
    # Get device configuration
    device_config = get_device_config()

    # Create MQTT device
    device = MqttClient(device_config)

    # Create hardware simulation
    hardware = PlantHardware(device_config["uid"], device)

    # Store hardware reference in device for message handlers to access
    device.hardware = hardware

    # Register message handlers
    device.register_handler("PING", handle_ping)
    device.register_handler("GET_STATE", handle_get_state)
    device.register_handler("SET_STATE", handle_set_state)
    device.register_handler("COMMAND", handle_command)

    try:
        # Start device in a separate thread
        device_thread = threading.Thread(target=device.start)
        device_thread.daemon = True
        device_thread.start()

        # Wait until device is paired before starting simulation
        logger.info("Waiting for device to be paired...")
        while not device.paired:
            time.sleep(1)

        # Start hardware simulation
        logger.info("Starting plant monitoring hardware simulation...")
        hardware.start_simulation()

        # Keep main thread running
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        logger.info("Stopping device...")
        hardware.stop_simulation()

if __name__ == "__main__":
    main()