export const devices = [
  {
    name: "Living Room Light",
    type: "binary", // on or off
    mutable: true,
    range: null,
    choices: ["on", "off"],
  },
  {
    name: "Thermostat",
    type: "range",
    mutable: false,
    range: [16, 30], // temperature range
    choices: null,
  },
  {
    name: "Air Quality Sensor",
    type: "enum",
    mutable: false,
    range: null,
    choices: ["Good", "Moderate", "Poor"],
  },
  {
    name: "Security Camera",
    type: "binary",
    mutable: true,
    range: null,
    choices: ["on", "off"],
  },
  {
    name: "Smart Lock",
    type: "enum",
    mutable: true,
    range: null,
    choices: ["locked", "unlocked", "jammed"],
  },
  {
    name: "Humidity Sensor",
    type: "range",
    mutable: false,
    range: [0, 100],
    choices: null,
  },
  {
    name: "Sprinkler System",
    type: "binary",
    mutable: true,
    range: null,
    choices: ["on", "off"],
  },
  {
    name: "Window Blind",
    type: "enum",
    mutable: true,
    range: null,
    choices: ["open", "closed", "half"],
  },
  {
    name: "Garage Door",
    type: "binary",
    mutable: true,
    range: null,
    choices: ["open", "closed"],
  },
  {
    name: "CO2 Sensor",
    type: "range",
    mutable: false,
    range: [300, 5000], // ppm
    choices: null,
  },
];
