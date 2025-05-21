# fan_device.py
import threading
import random
from datetime import datetime
from device_base import Device

# substitute mock_gpio with RPi.GPIO when using in Raspberry Pi
import mock_gpio as GPIO

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Fan configuration
        self.fan_pin = 19
        self.fan_status = "OFF"  # Default state

        # Lock for thread safety
        self.fan_lock = threading.Lock()

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _start_device(self):
        """Initialize GPIO for fan control"""
        try:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.fan_pin, GPIO.OUT)
            GPIO.output(self.fan_pin, GPIO.LOW)  # Fan off initially

            self.logger.info("GPIO initialized for fan control")
        except Exception as e:
            self.logger.error(f"Error initializing GPIO: {e}")

    def _stop_device(self):
        """Clean up GPIO on shutdown"""
        try:
            GPIO.output(self.fan_pin, GPIO.LOW)  # Ensure fan is off
            GPIO.cleanup(self.fan_pin)
            self.logger.info("GPIO cleanup completed")
        except Exception as e:
            self.logger.error(f"Error during GPIO cleanup: {e}")

    def set_fan_state(self, state):
        """Set fan state (ON or OFF)"""
        with self.fan_lock:
            if state not in ["ON", "OFF"]:
                self.logger.error(f"Invalid fan state: {state}")
                return False

            try:
                if state == "ON":
                    GPIO.output(self.fan_pin, GPIO.HIGH)
                    self.logger.info("Fan turned ON")
                else:
                    GPIO.output(self.fan_pin, GPIO.LOW)
                    self.logger.info("Fan turned OFF")

                self.fan_status = state

                # Update state via MQTT
                if self.paired:
                    self.publish_state_update(1, state)

                return True
            except Exception as e:
                self.logger.error(f"Error setting fan state: {e}")
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

        state_value = "unknown"
        if state_number == 1:  # Fan status
            state_value = self.fan_status

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
        if state_number == 1:  # Fan status
            success = self.set_fan_state(value)
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
        "model": "smart fan",
        "description": "no description",
        "type": "FAN",
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "status",
                "type": "ENUM",
                "choices": ["OFF", "ON"]
            }
        ],
        "commands": [],
        "events": []
    }