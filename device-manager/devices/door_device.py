# door_device.py
import time
import threading
import random
from datetime import datetime
from device_base import Device

# substitute mock_gpio with RPi.GPIO when using in Raspberry Pi
import mock_gpio as GPIO

class DeviceImp(Device):
    def __init__(self, device_config, broker="localhost", port=1883):
        super().__init__(device_config, broker, port)

        # Servo configuration
        self.servo_pin = 26
        self.door_status = "CLOSED"  # Default state

        # PWM setup
        self.pwm = None
        self.door_moving = False
        self.door_lock = threading.Lock()

    def _on_paired(self):
        """Called when device is paired"""
        self.logger.info("Device paired successfully")
        self._start_device()

    def _start_device(self):
        """Initialize GPIO for servo motor"""
        try:
            GPIO.setwarnings(False)
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(self.servo_pin, GPIO.OUT)

            # Initialize PWM
            self.pwm = GPIO.PWM(self.servo_pin, 50)  # 50 Hz
            self.pwm.start(0)
            self.logger.info("GPIO initialized for servo motor")
        except Exception as e:
            self.logger.error(f"Error initializing GPIO: {e}")

    def _stop_device(self):
        """Clean up GPIO on shutdown"""
        try:
            if self.pwm:
                self.pwm.stop()
            GPIO.cleanup(self.servo_pin)
            self.logger.info("GPIO cleanup completed")
        except Exception as e:
            self.logger.error(f"Error during GPIO cleanup: {e}")

    def set_angle(self, angle):
        """Set servo angle"""
        try:
            duty = 2 + (angle / 18)
            GPIO.output(self.servo_pin, True)
            if self.pwm:
                self.pwm.ChangeDutyCycle(duty)
            self.logger.info(f"Moving servo to {angle} degrees")
            time.sleep(0.5)
            GPIO.output(self.servo_pin, False)
            if self.pwm:
                self.pwm.ChangeDutyCycle(0)
        except Exception as e:
            self.logger.error(f"Error setting servo angle: {e}")

    def set_door_state(self, state):
        """Set the door state (OPEN or CLOSED)"""
        if state not in ["OPEN", "CLOSED"]:
            self.logger.error(f"Invalid door state: {state}")
            return False

        if state == self.door_status:
            self.logger.info(f"Door is already {state}")
            return True

        self.logger.info(f"Setting door state to: {state}")

        # Move servo in a separate thread to not block message handling
        def move_door():
            with self.door_lock:
                self.door_moving = True
                try:
                    if state == "OPEN":
                        self.set_angle(90)  # Open door
                        time.sleep(2)  # Time for opening door
                        self.set_angle(0)   # Stop motor
                    else:  # CLOSED
                        self.set_angle(-90)  # Close door
                        time.sleep(2)  # Time for closing door
                        self.set_angle(0)   # Stop motor

                    self.door_status = state
                except Exception as e:
                    self.logger.error(f"Error moving door: {e}")
                finally:
                    self.door_moving = False

        thread = threading.Thread(target=move_door)
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
        if state_number == 1:  # door status
            state_value = self.door_status

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

        if state_number == 1:  # door status
            if value in ["OPEN", "CLOSED"]:
                success = self.set_door_state(value)
            else:
                self.logger.error(f"Invalid door state value: {value}. Must be 'OPEN' or 'CLOSED'")
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
        "model": "Smart_Door_XR23",
        "description": "Smart door with open and close functionality",
        "type": "DOOR",
        "support_streaming": False,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "status",
                "type": "ENUM",
                "choices": ["CLOSED", "OPEN"]
            }
        ],
        "commands": [],
        "events": []
    }