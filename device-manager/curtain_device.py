# curtain_device.py
import time
import threading
import random
from datetime import datetime
from device_base import Device

# substitute mock_gpio with RPi.GPIO when using in Raspberry pi
import mock_gpio as GPIO

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Motor pins (28BYJ-48 with ULN2003)
        self.IN1 = 17
        self.IN2 = 18
        self.IN3 = 27
        self.IN4 = 22

        # Motor state
        self.curtain_status = "CLOSE"  # Default state
        self.motor_moving = False
        self.motor_lock = threading.Lock()

        # Step sequence for stepper motor
        self.step_sequence = [
            [1, 0, 0, 1],
            [1, 0, 0, 0],
            [1, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 1, 1],
            [0, 0, 0, 1]
        ]

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _start_device(self):
        """Initialize GPIO for stepper motor"""
        try:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BCM)
            GPIO.setup([self.IN1, self.IN2, self.IN3, self.IN4], GPIO.OUT)
            self.logger.info("GPIO initialized for stepper motor")
        except Exception as e:
            self.logger.error(f"Error initializing GPIO: {e}")

    def _stop_device(self):
        """Clean up GPIO on shutdown"""
        try:
            GPIO.cleanup([self.IN1, self.IN2, self.IN3, self.IN4])
            self.logger.info("GPIO cleanup completed")
        except Exception as e:
            self.logger.error(f"Error during GPIO cleanup: {e}")

    def step_motor(self, steps, delay=0.005):
        """Move the stepper motor a specified number of steps.
        Positive steps move clockwise (open), negative steps move counterclockwise (close)."""
        with self.motor_lock:
            self.motor_moving = True
            try:
                for _ in range(steps):
                    for step in self.step_sequence:
                        for i in range(4):
                            GPIO.output([self.IN1, self.IN2, self.IN3, self.IN4][i], step[i])
                        time.sleep(delay)
                self.logger.info(f"Motor moved {steps} steps")
            except Exception as e:
                self.logger.error(f"Error moving motor: {e}")
            finally:
                self.motor_moving = False

    def set_curtain_state(self, state):
        """Set the curtain state (OPEN or CLOSE)"""
        if state not in ["OPEN", "CLOSE"]:
            self.logger.error(f"Invalid curtain state: {state}")
            return False

        if state == self.curtain_status:
            self.logger.info(f"Curtain is already {state}")
            return True

        self.logger.info(f"Setting curtain state to: {state}")

        # Move motor in a separate thread to not block message handling
        def move_curtain():
            steps = 2048 if state == "OPEN" else -2048
            self.step_motor(steps)
            self.curtain_status = state

        thread = threading.Thread(target=move_curtain)
        thread.daemon = True
        thread.start()
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
        if state_number == 1:  # curtain status
            state_value = self.curtain_status

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

        if state_number == 1:  # curtain status
            if value in ["OPEN", "CLOSE"]:
                success = self.set_curtain_state(value)
            else:
                self.logger.error(f"Invalid curtain state value: {value}. Must be 'OPEN' or 'CLOSE'")
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

        # No commands defined for this device, log an error
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
        "model": "Smart_Curtain_700",
        "description": "Smart vertical curtain opener",
        "type": "CURTAIN",
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "status",
                "type": "ENUM",
                "choices": ["CLOSE", "OPEN"]
            }
        ],
        "commands": [],
        "events": []
    }