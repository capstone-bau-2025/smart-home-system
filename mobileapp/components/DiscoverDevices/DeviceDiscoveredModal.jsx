import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FullScreenModal from '../../components/UI/FullScreenModal';
import { useSelector, useDispatch } from 'react-redux';
import { configureDevice } from '../../api/services/deviceDiscoverService';
import { Ionicons } from '@expo/vector-icons';
import { setDevices } from '../../store/slices/devicesSlice';
import Toast from 'react-native-toast-message';
export default function DeviceDiscoveredModal({ visible, onClose, title, selectedDevice }) {
  const currentHub = useSelector((state) => state.hub.currentHub);
  const devices = useSelector((state) => state.devices.devices);
  const dispatch = useDispatch();

  const handlePress = async () => {
    try {
      await configureDevice(selectedDevice.uid,currentHub.serialNumber);
      dispatch(setDevices([...devices, selectedDevice]));
      Toast.show({
        type: 'success',  
        text1: 'Device Added',
        text2: `${selectedDevice.model} has been added to ${currentHub.name}.`,
        position: 'top',
        topOffset: 60,
        swipeable: true,
      });
      onClose();
    } catch (err) {
      console.error("Failed to configure device", err);
    }
  };
  

  return (
    <FullScreenModal visible={visible} onClose={onClose} title={title}>
<View style={styles.container}>
  <Ionicons name="checkmark-circle-outline" size={100} color="#e19b19" style={styles.icon} />

  <Text style={styles.infoText}>
    Add <Text style={styles.deviceName}>{selectedDevice?.model}</Text> to{" "}
    <Text style={styles.hubName}>{currentHub?.name}</Text>?
  </Text>

  <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={handlePress}>
    <Text style={styles.buttonText}>Add Device</Text>
  </Pressable>

  <Text style={styles.subText}>
    Once configured, the device will appear in the "General" room.
  </Text>
</View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  icon: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  deviceName: {
    fontWeight: "bold",
    color: "#e19b19",
  },
  hubName: {
    fontWeight: "bold",
    color: "#444",
  },
  button: {
    backgroundColor: "#e19b19",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  pressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  subText: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  }
  
});
