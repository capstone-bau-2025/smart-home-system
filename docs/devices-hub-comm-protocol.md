# MQTT Communication Protocol Documentation

This document outlines the communication protocol between devices and the central controller through an MQTT broker.

## Table of Contents
- [Overview](#overview)
- [Message Flow](#message-flow-and-topics)
- [Message Types](#message-types)
  - [Discovery Messages](#discovery-messages)
  - [Communication Messages Hub](#Communication-Messages-from-hub-to-device)
  - [Communication Messages Device](#Communication-Messages-from-device-to-hub)

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
  "message_type": "DISCOVERY_REQUEST",
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
      "description": "string"
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
IMPORTANT NOTE: after the device receives this message, it should send a [ping message](#Ping-Device) with same message_id to confirm the configuration.
```json
{
  "message_type": "CONFIG",
  "message_id": 1,
  "uid": "string",
  "username": "string",
  "password": "string",
  "status": "SUCCESS"  // or "FAILURE"
}
```

### Communication Messages from hub to device

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
  "value": "the current value of the state",
  "status": "SUCCESS"  // or "FAILURE"
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
  "command_number": 1
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
  "message_id": 1,
  "uid": "string"
}
```

**Response:** `device/device-uid/out/message-id`
```json
{
  "message_type": "PING",
  "message_id": 1,
  "uid": "string",
  "status": "SUCCESS"  // or "FAILURE"
}
```

### Communication Messages from device to hub

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

#### info Notification
Sent from device to central controller on topic: `device/device-uid/out`

```json
{
  "message_type": "INFO",
  "device_uid": 1234,
  "message": "maybe approve opperation that takes time, like door closed"
}
```
