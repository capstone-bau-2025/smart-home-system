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

    def add_device(self, device_module_path, config_module_path=None):
        """
        Generic method to add any device type to the manager

        Args:
            device_module_path (str): Import path to the device module (e.g., 'camera_device')
            config_module_path (str): Import path to the config module (if different from device)

        Returns:
            The created device instance
        """
        try:
            # Import device module
            device_module = importlib.import_module(device_module_path)

            # If config module not specified, try same as device module with "_config" suffix
            if not config_module_path:
                config_module_path = f"{device_module_path.split('.')[0]}_config"

            # Get config
            config_module = importlib.import_module(config_module_path)
            device_config = config_module.get_device_config()

            # Find the main device class in the module
            device_class = None
            module_name = device_module.__name__

            # First look for classes defined in this module (not imported)
            for name, obj in inspect.getmembers(device_module):
                if not inspect.isclass(obj):
                    continue

                # Check if class is defined in this module and is a device class
                if inspect.getmodule(obj).__name__ == module_name and ("Device" in name or "Client" in name):
                    device_class = obj
                    break

            # If no device class found in module, fallback to any imported class
            if not device_class:
                for name, obj in inspect.getmembers(device_module):
                    if inspect.isclass(obj) and ("Device" in name or "Client" in name):
                        device_class = obj
                        break

            if not device_class:
                self.logger.error(f"No device class found in {device_module_path}")
                return None

            # Create device instance
            device = device_class(device_config, self.broker, self.port)

            # Add special handlers for camera devices
            if device_module_path == "camera_device" and hasattr(device, "handle_get_streaming_link"):
                device.message_handlers["GET_STREAMING_LINK"] = device.handle_get_streaming_link
                self.logger.info("Registered streaming link handler for camera device")

            # Add device to manager's list
            self.devices.append(device)
            self.logger.info(f"Added device {device.device_uid} of type {device_class.__name__}")
            return device

        except Exception as e:
            self.logger.error(f"Error adding device from {device_module_path}: {str(e)}")
            import traceback
            self.logger.error(traceback.format_exc())
            return None

    def add_camera_device(self):
        """Convenience method to add a camera device"""
        return self.add_device("camera_device")

    def add_plant_monitor_device(self):
        """Convenience method to add a plant monitor device"""
        return self.add_device("plant_device")

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