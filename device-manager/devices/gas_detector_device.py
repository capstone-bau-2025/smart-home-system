# gas_detector_device.py
import threading
import time
from datetime import datetime
import spidev
from device_base import Device
import random

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Gas detector state
        self.status = "OFF"  # Default state
        self.gas_level = 0   # Current gas level (0-1000)

        # SPI setup for MQ6 sensor
        self.spi = None
        self.gas_channel = 0  # MQ6 connected to CH0

        # Thread for gas level readings
        self.detector_thread = None
        self.running = False

        # Gas detection threshold
        self.gas_threshold = 300

        # Device parameters
        self.update_interval = 1  # seconds

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _setup_spi(self):
        """Initialize SPI interface"""
        try:
            self.spi = spidev.SpiDev()
            self.spi.open(0, 0)  # SPI0, CE0
            self.spi.max_speed_hz = 1350000
            self.logger.info("SPI interface initialized")
            return True
        except Exception as e:
            self.logger.error(f"Failed to initialize SPI: {e}")
            return False

    def _read_channel(self, channel):
        """Read data from MCP3008 ADC channel (0-7)"""
        try:
            adc = self.spi.xfer2([1, (8 + channel) << 4, 0])
            data = ((adc[1] & 3) << 8) | adc[2]
            return data
        except Exception as e:
            self.logger.error(f"Error reading SPI channel: {e}")
            return 0

    def _start_device(self):
        """Start the gas detector hardware"""
        if self.detector_thread is not None and self.detector_thread.is_alive():
            return

        if not self._setup_spi():
            self.logger.error("Failed to start gas detector - SPI initialization failed")
            return

        self.running = True
        self.detector_thread = threading.Thread(target=self._detector_loop)
        self.detector_thread.daemon = True
        self.detector_thread.start()
        self.logger.info("Gas detector hardware started")

    def _stop_device(self):
        """Stop the gas detector hardware"""
        self.running = False
        if self.detector_thread is not None:
            self.detector_thread.join(timeout=1)

        if self.spi:
            try:
                self.spi.close()
                self.logger.info("SPI connection closed")
            except Exception as e:
                self.logger.error(f"Error closing SPI connection: {e}")

        self.logger.info("Gas detector hardware stopped")

    def _detector_loop(self):
        """Main detector loop that reads actual gas sensor values"""
        while self.running:
            if self.status == "ON":
                # Read actual gas level from MQ6 sensor
                self.gas_level = self._read_channel(self.gas_channel)

                # Check for gas detection event
                if self.gas_level > self.gas_threshold:
                    self.logger.warning(f"Gas detected! Level: {self.gas_level}")
                    if self.paired:
                        self.publish_event(1)  # Gas detected event
                else:
                    self.logger.debug(f"Current gas level: {self.gas_level}")

            time.sleep(self.update_interval)

    def set_detector_state(self, state):
        """Set the detector state (ON or OFF)"""
        if state not in ["ON", "OFF"]:
            self.logger.error(f"Invalid detector state: {state}")
            return False

        if state == self.status:
            self.logger.info(f"Detector is already {state}")
            return True

        self.logger.info(f"Setting detector state to: {state}")
        self.status = state

        # Notify hub about state change
        if self.paired:
            self.publish_state_update(1, state)

        return True

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

        state_value = "unknown"

        if state_number == 1:  # Status
            state_value = self.status
        else:
            self.logger.warning(f"Unknown state number: {state_number}")

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

        if state_number == 1:  # Status
            success = self.set_detector_state(value)
        else:
            self.logger.error(f"Unknown state number: {state_number}")

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

        # No commands defined for this device
        self.logger.error(f"Received unsupported command: {command_number}")

        response = {
            "message_id": message_id,
            "message_type": "RESPONSE",
            "status": "FAILURE",
            "reason": "No commands supported for this device",
            "timestamp": datetime.now().isoformat()
        }

        self.publish_response(message_id, response)

def get_device_config():
    uid = random.randint(1000, 9999)

    return {
        "uid": uid,
        "model": "MQ6 Gas Detector",
        "description": "Dangerous Gas Detector",
        "type": "SENSOR",
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "status",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            }
        ],
        "commands": [],
        "events": [
            {
                "number": 1,
                "name": "GAS_DETECTED",
                "description": "Device detected a dangerous gas"
            }
        ]
    }