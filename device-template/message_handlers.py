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

    # Get state value (in a real device, you would get the actual state)
    # For this template, we'll just return a default value
    state_value = "default_value"

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

    # Set state value (in a real device, you would set the actual state)
    # For this template, we'll just log it
    logger.info(f"Setting state {state_number} to value: {value}")

    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "status": "SUCCESS",
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)

    # Also notify the hub that the state has been updated
    device.publish_state_update(state_number, value)

def handle_command(device, message):
    """Handle COMMAND message from hub"""
    message_id = message.get("message_id")
    command_number = message.get("command_number")

    # Execute command (in a real device, you would execute the actual command)
    # For this template, we'll just log it
    logger.info(f"Executing command {command_number}")

    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "status": "SUCCESS",
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)