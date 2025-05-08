export const discoveredDevices = {
  "device1": {
    name: "Device 001",
    description: "string",
    areaId: 1,
    states: [
      {
        choices: ["on", "off"],
        number: 1,
        is_mutable: true,
        name: "power",
        type: "ENUM",
        min_range: 0,
        max_range: 1
      }
    ],
    commands: [
      {
        description: "string",
        number: 1,
        name: "toggle"
      }
    ],
    events: [
      {
        description: "string",
        number: 101,
        name: "powerChanged"
      }
    ],
    uid: 9007199254740001,
    model: "Model-A",
    type: "LIGHT",
    support_streaming: false
  },
  "device2": {
    name: "Device 002",
    description: "string",
    areaId: 1,
    states: [
      {
        choices: ["locked", "unlocked"],
        number: 2,
        is_mutable: true,
        name: "lockState",
        type: "ENUM",
        min_range: 0,
        max_range: 1
      }
    ],
    commands: [
      {
        description: "string",
        number: 2,
        name: "toggleLock"
      }
    ],
    events: [
      {
        description: "string",
        number: 102,
        name: "lockStateChanged"
      }
    ],
    uid: 9007199254740002,
    model: "Model-B",
    type: "DOOR",
    support_streaming: false
  },
  "device3": {
    name: "Device 003",
    description: "string",
    areaId: 1,
    states: [
      {
        choices: ["open", "closed"],
        number: 3,
        is_mutable: true,
        name: "curtainState",
        type: "ENUM",
        min_range: 0,
        max_range: 1
      }
    ],
    commands: [
      {
        description: "string",
        number: 3,
        name: "toggleCurtain"
      }
    ],
    events: [
      {
        description: "string",
        number: 103,
        name: "curtainStateChanged"
      }
    ],
    uid: 9007199254740003,
    model: "Model-C",
    type: "CURTAINS",
    support_streaming: false
  },
  "device4": {
    name: "Device 004",
    description: "string",
    areaId: 1,
    states: [
      {
        choices: ["motion", "no motion"],
        number: 4,
        is_mutable: true,
        name: "motionStatus",
        type: "ENUM",
        min_range: 0,
        max_range: 1
      }
    ],
    commands: [
      {
        description: "string",
        number: 4,
        name: "resetSensor"
      }
    ],
    events: [
      {
        description: "string",
        number: 104,
        name: "motionDetected"
      }
    ],
    uid: 9007199254740004,
    model: "Model-D",
    type: "SENSOR",
    support_streaming: true
  },
  "device5": {
    name: "Device 005",
    description: "string",
    areaId: 1,
    states: [
      {
        choices: [],
        number: 5,
        is_mutable: false,
        name: "temperature",
        type: "RANGE",
        min_range: -10,
        max_range: 50
      }
    ],
    commands: [],
    events: [
      {
        description: "string",
        number: 105,
        name: "temperatureReported"
      }
    ],
    uid: 9007199254740005,
    model: "Model-E",
    type: "THERMOMETER",
    support_streaming: true
  }
};
