import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import { use, useEffect, useState } from "react";
import SaveButton from "../../../components/UI/SaveButton";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  setScheduledTime,
  setTriggerType,
  setEventId,
  setDeviceId,
  setStateValueId,
  setStateTriggerValue,
} from "../../../store/slices/automationSlice";
import ListModal from "../../../components/AutomationScreen/ListModal";
import { Ionicons } from "@expo/vector-icons";
import { fetchDeviceByFilter } from "../../../api/services/deviceService";
import { getEventsByDeviceId } from "../../../api/services/deviceService";
import Toast from "react-native-toast-message";
export default function Event() {
  const [devicesModal, setDevicesModal] = useState(false);
  const [eventsModal, setEventsModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [eventDevices, setEventDevices] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventsById, setEventsById] = useState(null);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await fetchDeviceByFilter("EVENT");
        setEventDevices(devices);
        console.log("EVENT DEVICES", devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);
  useEffect(() => {
    if (selectedDevice) {
      const fetchEvents = async () => {
        try {
          const events = await getEventsByDeviceId(selectedDevice.id);
          setEventsById(events);
          console.log("EVENTS BY ID", events);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchEvents();
    }
  }, [selectedDevice]);

  const handleSave = () => {
    if (!selectedDevice || !selectedEvent) {
      Toast.show({
        type: "error",
        text1: "Select a device and event first",
        text2: "Please select a device and event to proceed.",
        topOffset: 60,
        swipeable: true,
      });
      return;
    }

    dispatch(setTriggerType("EVENT"));
    dispatch(setEventId(selectedEvent.id));
    dispatch(setDeviceId(selectedDevice.id));
    dispatch(setStateValueId(null));
    dispatch(setStateTriggerValue(null));
    dispatch(setScheduledTime(null));

    Toast.show({
      type: "success",
      text1: "Type selected",
      text2: "Automation type has been set to Event.",
      position: "top",
      topOffset: 60,
      swipeable: true,
    });
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
          style={({ pressed }) =>
            pressed
              ? [styles.inlineButton, { opacity: 0.7 }]
              : styles.inlineButton
          }
          onPress={() => {
            if (selectedEvent) {
              setSelectedEvent(null);
            }
            setDevicesModal(true);
          }}
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
          style={({ pressed }) =>
            pressed
              ? [styles.inlineButton, { opacity: 0.7 }]
              : styles.inlineButton
          }
          onPress={() => {
            if (!selectedDevice) {
              Toast.show({
                type: "error",
                text1: "Select a device first",
                text2: "Please select a device to view its events.",
                topOffset: 60,
                swipeable: true,
              });
              return;
            }

            setEventsModal(true);
          }}
        >
          <Text style={styles.buttonText}>Select</Text>
        </Pressable>

        <Text style={styles.selected}>
          Selected: {selectedEvent?.name || ""}
        </Text>
      </View>

      <View style={styles.footer}>
        <SaveButton onPress={handleSave} color="#2f5fa3" />
      </View>

      <ListModal
        visible={devicesModal}
        data={eventDevices}
        onSelect={(device) => {
          setSelectedDevice(device);
          setEventsModal(true);
        }}
        onClose={() => setDevicesModal(false)}
        buttonColor="#2f5fa3"
        choiceButtonColor="#2f5fa3"
      />

      <ListModal
        visible={eventsModal}
        data={eventsById}
        onSelect={(event) => setSelectedEvent(event)}
        onClose={() => setEventsModal(false)}
        title="Select Event"
        buttonColor="#2f5fa3"
        choiceButtonColor="#2f5fa3"
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
    backgroundColor: "#2f5fa3",
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
