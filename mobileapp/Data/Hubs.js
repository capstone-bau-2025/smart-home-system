export const hubs = [
  {
    id: "1",
    name: "hub1",
    users: [
      {
        id: "101",
        name: "user1",
        role: "admin",
        perms: {
          livingroom: true,
          bedroom: true,
          kitchen: true,
          bathroom: true,
        },
      },
      {
        id: "102",
        name: "useraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa2",
        role: "guest",
        perms: {
          livingroom: true,
          bedroom: false,
          kitchen: false,
          bathroom: false,
        },
      },
    ],
    rooms: [
      {
        id: "r1",
        name: "Living Room",
        icon: "tv-outline",
        devices: [
          { id: "d1", name: "Smart TV", type: "entertainment" },
          { id: "d2", name: "Smart Light", type: "lighting" },
          { id: "d3", name: "Smart Speaker", type: "audio" },
          { id: "d5", name: "Smart Thermostat", type: "climate" },
        ], 
      },
      {
        id: "r2",
        name: "Bedroom",
        icon: "bed-outline",
        devices: [
          { id: "d6", name: "Smart Bed", type: "comfort" },
          { id: "d8", name: "Smart Lights", type: "lighting" },
          { id: "d9", name: "Smart Fan", type: "climate" },
          { id: "d10", name: "Smart Security Camera", type: "security" },
          { id: "d7", name: "Smart Alarm Clock", type: "utility" },
          { id: "d11", name: "Smart Air Purifier", type: "climate" },
        ], 
      },
      {
        id: "r3",
        name: "Kitchen",
        icon: "restaurant-outline",
        devices: [
          { id: "d12", name: "Smart Oven", type: "appliance" },
          { id: "d14", name: "Smart Dishwasher", type: "appliance" },
          { id: "d15", name: "Smart Blender", type: "appliance" },
        ],
      },
      {
        id: "r4",
        name: "Bathroom",
        icon: "water-outline",
        devices: [
          { id: "d16", name: "Smart Mirror", type: "accessory" },
          { id: "d19", name: "Smart Toothbrush", type: "health" },
          { id: "d20", name: "Smart Shower System", type: "utility" },
        ],
      },
      {
        id: "r5",
        name: "Garage",
        icon: "car-outline",
        devices: [
          { id: "d21", name: "Smart Garage Door", type: "security" },
          { id: "d22", name: "Smart Car Charger", type: "energy" },
          { id: "d23", name: "Smart Security Camera", type: "security" },
          { id: "d24", name: "Smart Lights", type: "lighting" },
        ],
      },
      {
        id: "r6",
        name: "Office",
        icon: "desktop-outline",
        devices: [
          { id: "d26", name: "Smart Desk Lamp", type: "lighting" },
          { id: "d27", name: "Smart Monitor", type: "electronics" },
        ], 
      },
    ],
  },
  {
    id: "2",
    name: "hub2",
    users: [
      {
        id: "103",
        name: "user1",
        role: "user",
        perms: {
          livingroom: true,
          bedroom: true,
          kitchen: false,
          bathroom: false,
        },
      },
      
    ],
    rooms: [
      {
        id: "r7",
        name: "Living Room",
        icon: "tv-outline",
        devices: [
          { id: "d31", name: "Smart TV", type: "entertainment" },
          { id: "d32", name: "Smart Light", type: "lighting" },
          { id: "d35", name: "Smart Air Purifier", type: "climate" },
        ],
      },
      {
        id: "r8",
        name: "Bedroom",
        icon: "bed-outline",
        devices: [
          { id: "d36", name: "Smart Curtains", type: "automation" },
          { id: "d37", name: "Smart Lamp", type: "lighting" },
          { id: "d38", name: "Smart Air Conditioner", type: "climate" },
          { id: "d39", name: "Smart Humidifier", type: "climate" },
        ], 
      },
      {
        id: "r9",
        name: "Kitchen",
        icon: "restaurant-outline",
        devices: [
          { id: "d41", name: "Smart Microwave", type: "appliance" },
          { id: "d42", name: "Smart Kettle", type: "appliance" },
          { id: "d43", name: "Smart Pressure Cooker", type: "appliance" },
          { id: "d45", name: "Smart Trash Bin", type: "utility" },
          { id: "d44", name: "Smart Stove", type: "appliance" },
        ], 
      },
      {
        id: "r10",
        name: "Bathroom",
        icon: "water-outline",
        devices: [
    
        ], 
      },
    ],
  },

];
