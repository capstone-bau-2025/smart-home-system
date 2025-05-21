# interior_lighting_device.py
import threading
import random
from datetime import datetime
from device_base import Device

# substitute mock_gpio with RPi.GPIO when using in Raspberry Pi
import mock_gpio as GPIO

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # LED pins (connected to MOSFET gate terminals)
        self.power_led_pins = [16, 20, 21, 7, 25, 23]

        # LED states (initially all OFF)
        self.led_states = ["OFF"] * 6

        # Mutex for thread-safe LED operations
        self.led_lock = threading.Lock()

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _start_device(self):
        """Initialize GPIO for LEDs"""
        try:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BCM)

            # Setup all LED pins as output
            GPIO.setup(self.power_led_pins, GPIO.OUT)

            # Ensure all LEDs are off initially
            for pin in self.power_led_pins:
                GPIO.output(pin, GPIO.LOW)

            self.logger.info("GPIO initialized for power LEDs")
        except Exception as e:
            self.logger.error(f"Error initializing GPIO: {e}")

    def _stop_device(self):
        """Clean up GPIO on shutdown"""
        try:
            # Turn off all LEDs
            for pin in self.power_led_pins:
                GPIO.output(pin, GPIO.LOW)

            GPIO.cleanup(self.power_led_pins)
            self.logger.info("GPIO cleanup completed")
        except Exception as e:
            self.logger.error(f"Error during GPIO cleanup: {e}")

    def turn_on_led(self, led_index):
        """Turn on specific LED"""
        try:
            pin = self.power_led_pins[led_index]
            GPIO.output(pin, GPIO.HIGH)
            self.led_states[led_index] = "ON"
            self.logger.info(f"LED {led_index+1} turned ON")
        except Exception as e:
            self.logger.error(f"Error turning on LED {led_index+1}: {e}")
            return False
        return True

    def turn_off_led(self, led_index):
        """Turn off specific LED"""
        try:
            pin = self.power_led_pins[led_index]
            GPIO.output(pin, GPIO.LOW)
            self.led_states[led_index] = "OFF"
            self.logger.info(f"LED {led_index+1} turned OFF")
        except Exception as e:
            self.logger.error(f"Error turning off LED {led_index+1}: {e}")
            return False
        return True

    def set_led_state(self, led_number, state):
        """Set LED state (ON or OFF)"""
        with self.led_lock:
            led_index = led_number - 1  # Convert to 0-based index

            if led_index < 0 or led_index >= len(self.power_led_pins):
                self.logger.error(f"Invalid LED number: {led_number}")
                return False

            if state not in ["ON", "OFF"]:
                self.logger.error(f"Invalid LED state: {state}")
                return False

            success = False
            if state == "ON":
                success = self.turn_on_led(led_index)
            else:
                success = self.turn_off_led(led_index)

            # Update state via MQTT if successful
            if success and self.paired:
                self.publish_state_update(led_number, state)

            return success

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

        if 1 <= state_number <= 6:
            state_value = self.led_states[state_number - 1]
        else:
            state_value = "unknown"
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
        if 1 <= state_number <= 6:
            success = self.set_led_state(state_number, value)
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
        "model": "Power LED Controller",
        "description": "Control for 6 power LEDs via GPIO pins and MOSFETs",
        "type": "LIGHT",
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "LED 1",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            },
            {
                "number": 2,
                "is_mutable": True,
                "name": "LED 2",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            },
            {
                "number": 3,
                "is_mutable": True,
                "name": "LED 3",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            },
            {
                "number": 4,
                "is_mutable": True,
                "name": "LED 4",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            },
            {
                "number": 5,
                "is_mutable": True,
                "name": "LED 5",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            },
            {
                "number": 6,
                "is_mutable": True,
                "name": "LED 6",
                "type": "ENUM",
                "choices": ["ON", "OFF"]
            }
        ],
        "commands": [],
        "events": []
    }