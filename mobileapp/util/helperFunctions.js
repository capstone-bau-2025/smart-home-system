export const getIconName = (category) => {
  switch (category) {
    case 'light':
      return 'bulb-outline';
    case 'door':
      return 'log-out-outline';
    case 'curtains':
      return 'albums-outline';
    case 'ac':
      return 'snow-outline';
    case 'thermometer':
      return 'thermometer-outline';
    case 'sensor':
      return 'bonfire-outline';
    case 'garage':
      return 'car-outline';
    case 'hub':
      return 'home-outline';
    default:
      return 'help-circle-outline';
  }
};

export const getIconColor = (category) => {
  switch (category) {
    case 'light':
      return '#FFD700'; // gold/yellow
    case 'door':
      return '#8B4513'; // brown
    case 'curtains':
      return '#A52A2A'; // maroon
    case 'ac':
      return '#00BFFF'; // sky blue
    case 'thermometer':
      return '#FF4500'; // orange-red
    case 'sensor':
      return '#32CD32'; // green
    case 'garage':
      return '#000000'; // black
    case 'hub':
      return '#4682B4'; // steel blue
    default:
      return '#999'; // gray fallback
  }
};

export const getIconBgColor = (category) => {
  switch (category) {
    case 'light':
      return '#FFF8DC'; // light golden
    case 'door':
      return '#D2B48C'; // soft brown-beige
    case 'curtains':
      return '#F5DEDC'; // muted maroon-pink
    case 'ac':
      return '#E0F7FF'; // pale blue
    case 'thermometer':
      return '#FFE5D0'; // soft orange
    case 'sensor':
      return '#DCF8DC'; // pale green
    case 'garage':
      return '#E0E0E0'; // soft pale black/gray
    case 'hub': 
    return '#D0E0F7'; // light steel blue
      default:
      return '#F0F0F0'; // neutral fallback
  }
};
