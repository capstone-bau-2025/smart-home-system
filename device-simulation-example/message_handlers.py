# message_handlers.py
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("MessageHandlers")

def handle_ping(device, message):
    """Handle PING message from hub"""
    message_id = message.get("message_id")

    response = {
        "message_id": message_id,
        "message_type": "PING",
        "status": "SUCCESS",
        "uid": device.device_uid,
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)
    logger.info(f"Responded to PING message with ID: {message_id}")

def handle_get_state(device, message):
    """Handle GET_STATE message from hub"""
    message_id = message.get("message_id")
    state_number = message.get("state_number")

    # Get the actual state value from hardware
    state_value = "unknown"
    if hasattr(device, "hardware"):
        hw = device.hardware
        if state_number == 1:
            state_value = str(round(hw.soil_moisture, 1))
        elif state_number == 2:
            state_value = str(round(hw.soil_ph, 1))
        elif state_number == 3:
            state_value = str(hw.watering_duration)
        elif state_number == 4:
            state_value = hw.watering_status

    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "state_number": state_number,
        "value": state_value,
        "status": "SUCCESS",
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)
    logger.info(f"Responded to GET_STATE for state {state_number} with value: {state_value}")

def handle_set_state(device, message):
    """Handle SET_STATE message from hub"""
    message_id = message.get("message_id")
    state_number = message.get("state_number")
    value = message.get("value")

    success = False

    # Set the actual state value on hardware
    if hasattr(device, "hardware"):
        hw = device.hardware
        if state_number == 3:  # watering_duration
            success = hw.set_watering_duration(value)
        elif state_number == 4:  # watering_status
            if value == "ON":
                success = hw.start_watering()
            elif value == "OFF":
                success = hw.stop_watering()

    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "status": "SUCCESS" if success else "FAILURE",
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)

    # Notify that state has been updated
    if success:
        device.publish_state_update(state_number, value)

def handle_command(device, message):
    """Handle COMMAND message from hub"""
    message_id = message.get("message_id")
    command_number = message.get("command_number")

    success = False

    # Execute command on hardware
    if hasattr(device, "hardware"):
        hw = device.hardware
        if command_number == 1:  # START_WATERING
            success = hw.start_watering()
        elif command_number == 2:  # STOP_WATERING
            success = hw.stop_watering()

    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "status": "SUCCESS" if success else "FAILURE",
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)