import random

# Device Types (matching DeviceModel.DeviceModelType)
class DeviceType:
    LIGHT = "LIGHT"
    SWITCH = "SWITCH"
    CAMERA = "CAMERA"
    SENSOR = "SENSOR"
    OTHER = "OTHER"

# State Types (matching State.StateType)
class StateType:
    RANGE = "RANGE"
    ENUM = "ENUM"

def get_device_config():
    uid = random.randint(1000, 9999)

    return {
        "uid": uid,
        "model": "Camera Model Z1",
        "description": "Streaming camera with auto-shutdown feature",
        "type": DeviceType.CAMERA,
        "support_streaming": True,
        "states": [
            {
                "number": 1,
                "is_mutable": True,
                "name": "status",
                "type": StateType.ENUM,
                "choices": ["ON", "OFF"]
            },
            {
                "number": 2,
                "is_mutable": True,
                "name": "duration",
                "type": StateType.RANGE,
                "min_range": 5,
                "max_range": 120
            }
        ],
        "commands": [
            {
                "number": 1,
                "name": "RESTART",
                "description": "Restart camera device"
            }
        ],
        "events": [
            {
                "number": 1,
                "name": "DEVICE_STARTED",
                "description": "Device has started or restarted"
            },
            {
                "number": 2,
                "name": "AUTO_SHUTDOWN",
                "description": "Camera turned off automatically after duration elapsed"
            }
        ]
    }

