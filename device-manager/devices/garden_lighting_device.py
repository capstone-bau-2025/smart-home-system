# garden_lighting_device.py
import threading
import random
from datetime import datetime
from device_base import Device

# substitute mock_gpio with RPi.GPIO when using in Raspberry Pi
import mock_gpio as GPIO

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # LED pins for garden lights
        self.led_pins = [24]

        # Garden light status (all LEDs controlled together)
        self.light_status = "OFF"

        # Lock for thread safety
        self.led_lock = threading.Lock()

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _start_device(self):
        """Initialize GPIO for garden LEDs"""
        try:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BCM)

            # Setup all LED pins as output
            for pin in self.led_pins:
                GPIO.setup(pin, GPIO.OUT)
                GPIO.output(pin, GPIO.LOW)  # All LEDs off initially

            self.logger.info("GPIO initialized for garden LEDs")
        except Exception as e:
            self.logger.error(f"Error initializing GPIO: {e}")

    def _stop_device(self):
        """Clean up GPIO on shutdown"""
        try:
            # Turn off all LEDs
            for pin in self.led_pins:
                GPIO.output(pin, GPIO.LOW)

            GPIO.cleanup(self.led_pins)
            self.logger.info("GPIO cleanup completed")
        except Exception as e:
            self.logger.error(f"Error during GPIO cleanup: {e}")

    def set_light_state(self, state):
        """Set garden light state (ON or OFF)"""
        with self.led_lock:
            if state not in ["ON", "OFF"]:
                self.logger.error(f"Invalid garden light state: {state}")
                return False

            try:
                # Set all LEDs to the same state
                for pin in self.led_pins:
                    if state == "ON":
                        GPIO.output(pin, GPIO.HIGH)
                    else:
                        GPIO.output(pin, GPIO.LOW)

                self.light_status = state
                self.logger.info(f"Garden lights set to {state}")

                # Update state via MQTT
                if self.paired:
                    self.publish_state_update(1, state)

                return True
            except Exception as e:
                self.logger.error(f"Error setting garden light state: {e}")
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
        if state_number == 1:  # Garden light status
            state_value = self.light_status

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
        if state_number == 1:  # Garden light status
            success = self.set_light_state(value)
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
        "model": "Basic Garden LED",
        "description": "Basic LED for garden lighting",
        "type": "LIGHT",
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
        "events": []
    }