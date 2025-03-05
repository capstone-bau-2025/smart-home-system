# MQTT Communication Protocol Documentation

This document outlines the communication protocol between devices and the central controller through an MQTT broker.

## Table of Contents
- [Overview](#overview)
- [Message Flow](#message-flow-and-topics)
- [Message Types](#message-types)
  - [Discovery Messages](#discovery-messages)
  - [Communication Messages](#communication-messages)

## Overview

The protocol covers the following operations:
- Device discovery and configuration
- State management (get/set) 
- Command execution
- State update notification
- Event reporting
- Device health monitoring (ping)

## Message Flow and topics

```
Device                                 Central Controller
  |                                            |
  |---------- discovery/device-uid ----------->| // device discovery request or approve ping
  |                                            |
  |<----------- config/device-uid -------------| // credentials or ping
  |                                            |
  |                                            |
  |<--------- device/device-uid/in ------------| // get state, set state, command execution, or ping
  |                                            |
  |---------- device/device-uid/out ---------->| // state update, event notification, or approve ping
  |                                            |
  |----- device/device-uid/out/message-id ---->| // feedback or response to specific message
```

## Message Types

### Discovery Messages

#### Device Discovery Message
Sent from device to central controller on topic: `discovery/device-uid`

```json
{
  "uid": 1234,
  "model": "string",
  "description": "string",
  "type": "ENUM(CAMERA, SENSOR, SWITCH, OTHER)",
  "support_streaming": false, //if the device streams video or not (a camera for example).
  "states": [
    {
      "number": 1, // unique identifier for state with respect to the device
      "is_mutable": false, // can the state can be changed by user or not?
      "name": "string",
      "type": "RANGE",
      "min_range": 0,   // specific to RANGE type
      "max_range": 100  // specific to RANGE type
    },
    {
      "number": 2,
      "is_mutable": true,
      "name": "string",
      "type": "ENUM",
      "choices": ["ON", "OFF"] // specific to ENUM type
    }
  ],
  "commands": [
    {
      "number": 1,
      "name": "string",
      "description": "string",
      "parameters": [
        {
          "name": "string",
          "type": "ENUM(ENUM, RANGE)",
          // Add either "choices" or "min_range"/"max_range" based on type similar to states
        }
      ]
    }
  ],
  "events": [
    {
      "number": 1,
      "name": "string",
      "description": "string"
    }
  ]
}
```

#### Configuration Reply
Sent from central controller to device on topic: `config/device-uid` as reply to discovery message after user approve.

```json
{
  "message_type": "CONFIG",
  "uid": "string",
  "username": "string",
  "password": "string"
}
```

#### Discovery Ping
Used to verify device is still waiting for discovery. Sent between topics `discovery/device-uid` and `config/device-uid`.
device should reply with same message.
```json
{
  "message_type": "PING",
  "uid": "string"
}
```

### Communication Messages

#### Set State Value
Sent from central controller to device on topic: `device/device-uid/in`

**Request:**
```json
{
  "message_type": "SET_STATE",
  "message_id": 1,
  "device_uid": 1234,
  "state_number": 1,
  "value": "the target value"
}
```

**Response:** on topic `device/device-uid/out/message-id`
```json
{
  "message_type": "RESPONSE",
  "message_id": 1,
  "status": "SUCCESS"  // or "FAILURE"
}
```

#### Get State Value
Sent from central controller to device on topic: `device/device-uid/in`

**Request:**
```json
{
  "message_type": "GET_STATE",
  "message_id": 20,
  "device_uid": 1234,
  "state_number": 1
}
```

**Response:** on topic `device/device-uid/out/message-id`
```json
{
  "message_type": "RESPONSE",
  "message_id": 20,
  "state_number": 1,
  "value": "the current value of the state"
}
```

#### Send Command
Sent from central controller to device on topic: `device/device-uid/in`

**Request:**
```json
{
  "message_type": "COMMAND",
  "message_id": 22,
  "device_uid": 1234,
  "command_number": 1,
  "parameters": [
    {
      "name": "param1",
      "value": "value1"
    },
    {
      "name": "param2",
      "value": "value2"
    }
  ]
}
```

**Response:** on topic `device/device-uid/out/message-id`
```json
{
  "message_type": "RESPONSE",
  "message_id": 22,
  "status": "SUCCESS"  // or "FAILURE"
}
```

#### Ping Device
Used for health monitoring. Topic: `device/device-uid/in`

**Request:**
```json
{
  "message_type": "PING",
  "uid": "string"
}
```

**Response:** `device/device-uid/out`
```json
{
  "message_type": "PING",
  "uid": "string"
}
```

#### Event Notification
Sent from device to central controller on topic: `device/device-uid/out`

```json
{
  "message_type": "EVENT",
  "device_uid": 1234,
  "event_number": 3
}
```

#### State Update Notification
Sent from device to central controller on topic: `device/device-uid/out`

```json
{
  "message_type": "STATE_UPDATED",
  "device_uid": 1234,
  "state_number": 3,
  "state_value": "the new value"
}
```
