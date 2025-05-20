import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  SafeAreaView,
} from "react-native";
import { useState, useEffect } from "react";
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
import {
  fetchDeviceByFilter,
  getStateValuesByDeviceId,
} from "../../../api/services/deviceService";
import Toast from "react-native-toast-message";

export default function StatusChange() {
  const [devicesModal, setDevicesModal] = useState(false);
  const [statesModal, setStatesModal] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [triggerValue, setTriggerValue] = useState(0);
  const [immutableDevices, setImmutableDevices] = useState(null);
  const [states, setStates] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await fetchDeviceByFilter("IMMUTABLE_STATE");
        setImmutableDevices(devices);
        console.log("IMMUTABLE DEVICES", devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      const fetchStates = async () => {
        try {
          const states = await getStateValuesByDeviceId(
            selectedDevice.id,
            "IMMUTABLE"
          );
          setStates(states);
          console.log("STATES BY ID", states);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };

      fetchStates();
    }
  }, [selectedDevice]);

  const handleSave = () => {
    if (!selectedDevice || !selectedState) {
      Toast.show({
        type: "error",
        text1: "Missing selection",
        text2: "Please select both a device and a status.",
        topOffset: 60,
        swipeable: true,
      });
      return;
    }

    dispatch(setTriggerType("STATE_UPDATE"));
    dispatch(setDeviceId(selectedDevice.id));
    dispatch(setStateValueId(selectedState.id));
    dispatch(setStateTriggerValue(selectedState.value));
    dispatch(setScheduledTime(null));
    dispatch(setEventId(null));
    Toast.show({
      type: "success",
      text1: "Type selected",
      text2: "Automation type has been set to Device Status Change.",
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
          <Ionicons name="bulb-outline" size={24} color="#6a11cb" />
        </View>
        <Text style={styles.title}>Device Status Change</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Trigger Device</Text>
        <Pressable
          style={({ pressed }) =>
            pressed
              ? [styles.inlineButton, { opacity: 0.7 }]
              : styles.inlineButton
          }
          onPress={() => setDevicesModal(true)}
        >
          <Text style={styles.buttonText}>Select</Text>
        </Pressable>
        <Text style={styles.selected}>
          Selected: {selectedDevice?.name || ""}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Trigger Status</Text>
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
                text2: "Please select a device to view its statuses.",
                topOffset: 60,
                swipeable: true,
              });
              return;
            }
            setStatesModal(true);
          }}
        >
          <Text style={styles.buttonText}>Select</Text>
        </Pressable>
        <Text style={styles.selected}>
          Selected:{" "}
          {selectedState
            ? `${selectedState.name}, Value = ${selectedState.value}`
            : ""}
        </Text>
      </View>

      <View style={styles.footer}>
        <SaveButton onPress={handleSave} color="#6a11cb" />
      </View>

      <ListModal
        visible={devicesModal}
        data={immutableDevices}
        buttonColor="#6a11cb"
        choiceButtonColor="#6a11cb"
        onSelect={(device) => {setSelectedDevice(device)
          setStatesModal(true);
        }}
        onClose={() => setDevicesModal(false)}
      />

      <ListModal
        visible={statesModal}
        data={states}
        onSelect={(state) => setSelectedState(state)}
        onClose={() => setStatesModal(false)}
        title="Select Status"
        setTriggerValue={setTriggerValue}
        triggerValue={triggerValue}
        buttonColor="#6a11cb"
        choiceButtonColor="#6a11cb"
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
    backgroundColor: "#6a11cb",
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
    backgroundColor: "#efe3ff",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
});
