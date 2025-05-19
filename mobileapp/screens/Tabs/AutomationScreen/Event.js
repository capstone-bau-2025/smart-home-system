import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useState } from "react";
import SaveButton from "../../../components/UI/SaveButton";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  setType,
  setIfDevice,
  setIfDeviceStatus,
  clearScheduleFields,
  clearStatusChangeFields,
} from "../../../store/slices/automationSlice";
import ListModal from "../../../components/AutomationScreen/ListModal";
import { Ionicons } from "@expo/vector-icons";

export default function Event() {
  const [devicesModal, setDevicesModal] = useState(false);
  const [eventsModal, setEventsModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const dummyDevices = [
    { id: "dev1", name: "Living Room Sensor" },
    { id: "dev2", name: "Front Door" },
      { id: "brightness", name: "Brightness", min: 0, max: 100 },
  { id: "volume", name: "Volume", min: 1, max: 10 },
  ];

  const dummyEvents = [
    { id: "open", name: "Opened" },
    { id: "motion", name: "Motion Detected" },
  ];

  const handleSave = () => {
    if (!selectedDevice || !selectedEvent) {
      alert("Please select both a device and an event.");
      return;
    }

    dispatch(setType("event"));
    dispatch(setIfDevice(selectedDevice.id));
    dispatch(setIfDeviceStatus(selectedEvent.id));
    dispatch(clearScheduleFields());
    dispatch(clearStatusChangeFields());

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconWrapper}>
          <Ionicons name="eye-outline" size={24} color="#2f5fa3" />
        </View>
        <Text style={styles.title}>Event Trigger</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Trigger Device</Text>
        <Pressable
          style={styles.inlineButton}
          onPress={() => setDevicesModal(true)}
        >
          <Text style={styles.buttonText}>Select</Text>
        </Pressable>

        <Text style={styles.selected}>
          Selected: {selectedDevice?.name || ""}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Trigger Event</Text>
        <Pressable
          style={styles.inlineButton}
          onPress={() => setEventsModal(true)}
        >
          <Text style={styles.buttonText}>Select</Text>
        </Pressable>

        <Text style={styles.selected}>
          Selected: {selectedEvent?.name || ""}
        </Text>
      </View>

      <View style={styles.footer}>
        <SaveButton onPress={handleSave} />
      </View>

      <ListModal
        visible={devicesModal}
        data={dummyDevices}
        onSelect={(device) => setSelectedDevice(device)}
        onClose={() => setDevicesModal(false)}
      />

      <ListModal
        visible={eventsModal}
        data={dummyEvents}
        onSelect={(event) => setSelectedEvent(event)}
        onClose={() => setEventsModal(false)}
        title="Select Event"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 90 : 0,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Lexend-Bold",
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    width: "85%",
  },
  label: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    marginBottom: 10,
    color: "#333",
  },
  inlineButton: {
    alignSelf: "flex-start",
    backgroundColor: "#fcae11",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "Lexend-Bold",
    fontSize: 16,
  },
  selected: {
    fontSize: 18,
    fontFamily: "Lexend-Regular",
    color: "#000",
  },
  footer: {
    marginTop: "auto",
    width: "90%",
    marginBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  iconWrapper: {
    backgroundColor: "#e3f0ff",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
