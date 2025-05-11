# gas_detector_device.py
import random
import threading
import time
from datetime import datetime
from device_base import Device

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Gas detector state
        self.status = "OFF"  # Default state
        self.gas_level = 0   # Current gas level (0-1000)

        # Thread for gas level simulation
        self.detector_thread = None
        self.running = False

        # Gas detection threshold
        self.gas_threshold = 300

        # Device parameters
        self.update_interval = 2  # seconds

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _start_device(self):
        """Start the gas detector simulation"""
        if self.detector_thread is not None and self.detector_thread.is_alive():
            return

        self.running = True
        self.detector_thread = threading.Thread(target=self._detector_loop)
        self.detector_thread.daemon = True
        self.detector_thread.start()
        self.logger.info("Gas detector hardware started")

    def _stop_device(self):
        """Stop the gas detector simulation"""
        self.running = False
        if self.detector_thread is not None:
            self.detector_thread.join(timeout=1)
        self.logger.info("Gas detector hardware stopped")

    def _detector_loop(self):
        """Main detector loop that simulates gas level readings"""
        while self.running:
            if self.status == "ON":
                # Simulate gas level readings (normally reading from MCP3008 ADC)
                # Occasionally generate high readings to simulate gas detection
                if random.randint(1, 100) > 95:  # 5% chance of high reading
                    self.gas_level = random.randint(self.gas_threshold, 1000)
                else:
                    self.gas_level = random.randint(0, self.gas_threshold - 50)

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