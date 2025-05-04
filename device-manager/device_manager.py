# device_manager.py
import logging
import threading
import importlib
import inspect

class DeviceManager:
    def __init__(self, broker="localhost", port=1883):
        self.broker = broker
        self.port = port
        self.devices = []
        self.logger = logging.getLogger("DeviceManager")

    def add_device(self, device_module):
        """
        Add a device to the manager

        Args:
            device_module: Device module or instance

        Returns:
            The device instance
        """
        try:
            device_config = device_module.get_device_config()
            device = device_module.DeviceImp(device_config, self.broker, self.port)

            # Add camera-specific handlers if needed
            if device_config["type"] == "CAMERA":
                device.message_handlers["GET_STREAMING_LINK"] = device.handle_get_streaming_link
                self.logger.info("Registered streaming link handler for camera device")

            # Add device to manager's list
            self.devices.append(device)
            self.logger.info(f"Added device {device.device_uid} of model {device_config["model"]}")
            return device

        except Exception as e:
            self.logger.error(f"Error adding device: {str(e)}")
            import traceback
            self.logger.error(traceback.format_exc())
            return None

    def start_all_devices(self):
        """Start all devices"""
        self.logger.info(f"Starting {len(self.devices)} devices...")

        for device in self.devices:
            thread = threading.Thread(target=device.start)
            thread.daemon = True
            thread.start()
            self.logger.info(f"Started device {device.device_uid}")

    def stop_all_devices(self):
        """Stop all devices"""
        self.logger.info(f"Stopping {len(self.devices)} devices...")

        for device in self.devices:
            if hasattr(device, "stop"):
                device.stop()
                self.logger.info(f"Stopped device {device.device_uid}")