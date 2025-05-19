export const getIconName = (category) => {
  switch (category?.toUpperCase()) {
    case "LIGHT":
      return "bulb-outline";
    case "DOOR":
      return "log-out-outline";
    case "CURTAIN":
      return "albums-outline";
    case "AC":
      return "snow-outline";
    case "THERMOMETER":
      return "thermometer-outline";
    case "SENSOR":
      return "bonfire-outline";
    case "GARAGE":
      return "car-outline";
    case "HUB":
      return "home-outline";
    case "CAMERA":
      return "camera-outline";
    default:
      return "help-circle-outline";
  }
};

export const getIconColor = (category) => {
  switch (category?.toUpperCase()) {
    case "LIGHT":
      return "#f1c40f"; // bright yellow
    case "DOOR":
      return "#e67e22"; // orange (easy to spot, warm tone)
    case "CURTAIN":
      return "#8e44ad"; // deep purple
    case "AC":
      return "#3498db"; // cool blue
    case "THERMOMETER":
      return "#e74c3c"; // red-orange for temperature
    case "SENSOR":
      return "#27ae60"; // green (sensors/environment)
    case "GARAGE":
      return "#34495e"; // dark slate (mechanical)
    case "HUB":
      return "#2c3e50"; // strong steel blue
    case "CAMERA":
      return "#2c3e50"; // strong steel blue
    default:
      return "#7f8c8d"; // neutral gray
  }
};

export const getIconBgColor = (category) => {
  switch (category?.toUpperCase()) {
    case "LIGHT":
      return "#fcf3cf"; // soft yellow background
    case "DOOR":
      return "#fce9d3"; // light warm orange
    case "CURTAIN":
      return "#f5eef8"; // muted lavender
    case "AC":
      return "#eaf6fb"; // pale cool blue
    case "THERMOMETER":
      return "#fdecea"; // soft red-orange
    case "SENSOR":
      return "#eafaf1"; // light green
    case "GARAGE":
      return "#ecf0f1"; // soft gray
    case "HUB":
      return "#d6eaf8"; // muted blue
    case "CAMERA":
      return "#d1d1d1"; // pale black (light gray with a black tint)
    default:
      return "#f4f4f4"; // fallback neutral
  }
};

export const iconOptions = {
  1: "home-outline",
  2: "bed-outline",
  3: "tv-outline",
  4: "water-outline",
  5: "restaurant-outline",
  6: "desktop-outline",
  7: "cafe-outline",
  8: "car-outline",
  9: "leaf-outline",
  10: "game-controller-outline",
  11: "shirt-outline",
  12: "basket-outline",
  13: "sparkles-outline",
  14: "happy-outline",
  15: "people-outline",
  16: "print-outline",
  17: "laptop-outline",
  18: "sunny-outline",
  19: "cart-outline",
  20: "musical-notes-outline",
  21: "body-outline",
  22: "paw-outline",
  23: "heart-outline",
  24: "book-outline",
  25: "football-outline",
};
