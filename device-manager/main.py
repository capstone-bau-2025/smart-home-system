# main.py
import logging
import time
import signal
import sys
from device_manager import DeviceManager

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(name)s - %(message)s')
logger = logging.getLogger("DeviceManagerApp")

def signal_handler(sig, frame):
    logger.info("Shutting down device manager...")
    manager.stop_all_devices()
    sys.exit(0)

if __name__ == "__main__":
    # Create device manager
    manager = DeviceManager()

    # Register signal handler for clean shutdown
    signal.signal(signal.SIGINT, signal_handler)

    # Add devices (using convenience methods or generic method)
    logger.info("Creating devices...")

    from devices import (plant_device,
                         camera_device,
                         curtain_device,
                         door_device,
                         fan_device,
                         garden_lighting_device,
                         gas_detector_device,
                         interior_lighting_device,
                         temperature_humidity_device)

    manager.add_device(plant_device)
    manager.add_device(camera_device)
    manager.add_device(curtain_device)
    manager.add_device(door_device)
    manager.add_device(fan_device)
    manager.add_device(garden_lighting_device)
    manager.add_device(gas_detector_device)
    manager.add_device(interior_lighting_device)
    manager.add_device(temperature_humidity_device)

    # Start all devices
    logger.info("Starting device manager...")
    manager.start_all_devices()

    # Keep main thread running
    logger.info("Device manager running. Press Ctrl+C to exit.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down device manager...")
        manager.stop_all_devices()