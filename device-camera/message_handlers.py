import logging
from datetime import datetime
from device_hardware import (
    set_camera_state, 
    get_camera_state,
    set_auto_shutdown_duration,
    get_auto_shutdown_duration
)

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

    # Get the actual state value directly from stream_test module
    if state_number == 1:
        state_value = get_camera_state()
    elif state_number == 2:
        state_value = get_auto_shutdown_duration()
    else:
        state_value = "unknown"

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

    # Set the state value and take appropriate action
    try:
        if state_number == 1:  # Camera status
            if value in ["ON", "OFF"]:
                # Use the publish_event as callback for auto-shutdown events
                def publish_event_callback(event_number):
                    device.publish_event(event_number)
                    
                # Use the publish_state_update to inform hub about state changes
                def publish_state_callback(state_number, state_value):
                    device.publish_state_update(state_number, state_value)
                    
                # Set the camera state directly
                set_camera_state(value, publish_event_callback, publish_state_callback)
                status = "SUCCESS"
            else:
                status = "FAILURE"
                logger.error(f"Invalid status value: {value}. Must be 'ON' or 'OFF'")
        
        elif state_number == 2:  # Auto-shutdown duration (in minutes)
            try:
                duration = int(value)
                
                # Use the publish_state_update to inform hub about state changes
                def publish_state_callback(state_number, state_value):
                    device.publish_state_update(state_number, state_value)
                    
                if set_auto_shutdown_duration(duration, publish_state_callback):
                    status = "SUCCESS"
                else:
                    status = "FAILURE"
                    logger.error(f"Duration value {duration} out of range (1-60 minutes)")
            except ValueError:
                status = "FAILURE"
                logger.error(f"Invalid duration value: {value}. Must be a number between 1-60")
        else:
            status = "FAILURE"
            logger.error(f"Unknown state number: {state_number}")

    except Exception as e:
        status = "FAILURE"
        logger.error(f"Error setting state: {e}")

    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "status": status,
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)

def handle_command(device, message):
    """Handle COMMAND message from hub"""
    message_id = message.get("message_id")
    command_number = message.get("command_number")

    # Execute command
    status = "SUCCESS"
    
    if command_number == 1:  # RESTART
        logger.info("Executing restart command")
        # First turn off the camera
        set_camera_state("OFF")
        
        # Prepare callbacks for state updates and events
        def publish_event_callback(event_number):
            device.publish_event(event_number)
            
        def publish_state_callback(state_number, state_value):
            device.publish_state_update(state_number, state_value)
            
        # Then turn it back on with callbacks
        set_camera_state("ON", publish_event_callback, publish_state_callback)
    else:
        status = "FAILURE"
        logger.warning(f"Unknown command number: {command_number}")

    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "status": status,
        "timestamp": datetime.now().isoformat()
    }

    device.publish_response(message_id, response)

def handle_get_streaming_link(device, message):
    """Handle GET_STREAMING_LINK message from hub"""
    message_id = message.get("message_id")
    
    # Get current camera state directly from stream_test
    camera_state = get_camera_state()
    
    response = {
        "message_id": message_id,
        "message_type": "RESPONSE",
        "uid": device.device_uid,
        "streaming_link": f"http://{device.get_ip_address()}:8000/video",
        "status": "SUCCESS" if camera_state == "ON" else "FAILURE",
        "timestamp": datetime.now().isoformat()
    }
    
    device.publish_response(message_id, response)
    logger.info(f"Responded to GET_STREAMING_LINK message with ID: {message_id}")
