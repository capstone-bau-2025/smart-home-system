import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "customInteractionNames";

// Generate a unique key for interaction
const getInteractionKey = (interaction) => {
  if (interaction.stateValueId) return interaction.stateValueId.toString();
  if (interaction.commandId) return `cmd_${interaction.commandId}`;
  return null;
};

export const getCustomNamesMap = async () => {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getCustomName = async (interaction) => {
  const key = getInteractionKey(interaction);
  if (!key) return null;
  const map = await getCustomNamesMap();
  return map[key] || null;
};

export const setCustomName = async (interaction, name) => {
  const key = getInteractionKey(interaction);
  if (!key) {
    console.warn("❌ No valid key found — skipping rename");
    return;
  }

  const map = await getCustomNamesMap();
  map[key] = name;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    console.log(`✅ Custom name set for ${key}: "${name}"`);
  } catch (err) {
    console.error("❌ Failed to save custom name:", err);
  }
};
