export const automations = [
  {
    id: 1,
    name: "Morning Routine",
    description: "Automatically adjusts lights and temperature at 7:00 AM. loremipsum Lorem ipsum, dolor sit amet consectetur adipisicing elit. Non placeat nemo ad", 
    status: "Active",
    type: "schedule",
    action: "Turn on bedroom lights and set thermostat to 72°F",
    cooldownDuration: 10,
  },
  {
    id: 2,
    name: "Night Mode",
    description: "Turns off unnecessary devices and dims lights at bedtime.",
    status: "Active",
    type: "schedule",
    action: "Dim living room lights and turn off TV",
    cooldownDuration: 90,
  },
  {
    id: 3,
    name: "Cool Down Room",
    description: "Lowers the room temperature when it exceeds 75°F.",
    status: "Inactive",
    type: "device_status_change",
    action: "Turn on AC",
    cooldownDuration: 10,
  },
{
  id: 4,
  name: "Motion Detected",
  description: "Triggers when motion is detected in the hallway after 10 PM.",
  status: "Active",
  type: "event",
  action: "Turn on hallway light",
  cooldownDuration: 15,
}

];
