import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import SaveButton from "../../../components/UI/SaveButton";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import ListModal from "../../../components/AutomationScreen/ListModal";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import {
  fetchDeviceByFilter,
  getCommandsByDeviceId,
  getStateValuesByDeviceId,
} from "../../../api/services/deviceService";
import { setActions } from "../../../store/slices/automationSlice";

export default function Action() {
  // Modals
  const [mutableDevicesModal, setMutableDevicesModal] = useState(false);
  const [statesModal, setStatesModal] = useState(false);
  const [commandDevicesModal, setCommandDevicesModal] = useState(false);
  const [commandsModal, setCommandsModal] = useState(false);

  // Selections
  const [selectedMutableDevice, setSelectedMutableDevice] = useState(null);
  const [selectedMutableState, setSelectedMutableState] = useState(null);
  const [selectedCommandDevice, setSelectedCommandDevice] = useState(null);
  const [selectedCommandAction, setSelectedCommandAction] = useState(null);
  const [triggerValue, setTriggerValue] = useState(null);

  // Data
  const [mutableDevices, setMutableDevices] = useState(null);
  const [commandDevices, setCommandDevices] = useState(null);
  const [states, setStates] = useState(null);
  const [commands, setCommands] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const mutable = await fetchDeviceByFilter("MUTABLE_STATE");
        const command = await fetchDeviceByFilter("COMMAND");
        setMutableDevices(mutable);
        setCommandDevices(command);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  console.log(selectedMutableDevice, "selectedMutableDevice");
  console.log(states);

  useEffect(() => {
    if (selectedMutableDevice) {
      (async () => {
        try {
          const result = await getStateValuesByDeviceId(
            selectedMutableDevice.id,
            "MUTABLE"
          );
          console.log("✅ States fetched:", result);
          setStates(result);
        } catch (err) {
          console.error("❌ Failed to fetch states:", err);
        }
      })();
    }
  }, [selectedMutableDevice]);

  useEffect(() => {
    if (selectedCommandDevice) {
      (async () => {
        try {
          const result = await getCommandsByDeviceId(
            selectedCommandDevice.id,
            "COMMAND"
          );
          console.log("✅ Commands:", result);
          setCommands(result);
        } catch (err) {
          console.error("❌ Failed to fetch commands:", err);
        }
      })();
    }
  }, [selectedCommandDevice]);
  const handleSave = () => {
    // if (
    //   !selectedMutableDevice ||
    //   !selectedMutableState ||
    //   !selectedCommandDevice ||
    //   !selectedCommandAction
    // ) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Missing fields",
    //     text2: "Select all four fields before saving.",
    //     topOffset: 60,
    //   });
    //   return;
    // }

    dispatch(
      setActions([
        {
          type: "STATE_UPDATE",
          deviceId: selectedMutableDevice.id,
          stateValueId: selectedMutableState.id,
          actionValue: 'ON',
        },
                {
          type: "STATE_UPDATE",
          deviceId: selectedMutableDevice.id,
          stateValueId: selectedMutableState.id,
          actionValue: 'ON',
        },
                {
          type: "STATE_UPDATE",
          deviceId: selectedMutableDevice.id,
          stateValueId: selectedMutableState.id,
          actionValue: 'ON',
        },
                {
          type: "STATE_UPDATE",
          deviceId: selectedMutableDevice.id,
          stateValueId: selectedMutableState.id,
          actionValue: 'ON',
        },
      ])
    );

    Toast.show({
      type: "success",
      text1: "Action saved",
      text2: "Your action has been saved successfully.",
      position: "top",
      topOffset: 60,
    });

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: "center" }}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Ionicons name="flash" size={24} color="#244ced" />
          </View>
          <Text style={styles.title}>Action</Text>
        </View>

        {/* MUTABLE STATE */}
        <View style={styles.card}>
          <Text style={styles.label}>Select a Mutable Device</Text>
          <Pressable
            style={styles.inlineButton}
            onPress={() => setMutableDevicesModal(true)}
          >
            <Text style={styles.buttonText}>Select</Text>
          </Pressable>
          <Text style={styles.selected}>
            {selectedMutableDevice?.name || ""}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Mutable State</Text>
          <Pressable
            style={styles.inlineButton}
            onPress={() => {
              if (!selectedMutableDevice) {
                Toast.show({
                  type: "error",
                  text1: "Select mutable device first",
                });
                return;
              }
              setStatesModal(true);
            }}
          >
            <Text style={styles.buttonText}>Select</Text>
          </Pressable>
          <Text style={styles.selected}>
            {selectedMutableState
              ? `${selectedMutableState.name}: ${selectedMutableState.value}`
              : ""}
          </Text>
        </View>

        {/* COMMAND */}
        <View style={styles.card}>
          <Text style={styles.label}>Command Device</Text>
          <Pressable
            style={styles.inlineButton}
            onPress={() => setCommandDevicesModal(true)}
          >
            <Text style={styles.buttonText}>Select</Text>
          </Pressable>
          <Text style={styles.selected}>
            {selectedCommandDevice?.name || ""}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Command Action</Text>
          <Pressable
            style={styles.inlineButton}
            onPress={() => {
              if (!selectedCommandDevice) {
                Toast.show({
                  type: "error",
                  text1: "Select command device first",
                });
                return;
              }
              setCommandsModal(true);
            }}
          >
            <Text style={styles.buttonText}>Select</Text>
          </Pressable>
          <Text style={styles.selected}>
            {selectedCommandAction?.name || ""}
          </Text>
        </View>

        <View style={styles.footer}>
          <SaveButton onPress={handleSave} />
        </View>
      </ScrollView>

      {/* Modals */}
      <ListModal
        visible={mutableDevicesModal}
        data={mutableDevices}
        onSelect={(device) => {
          setSelectedMutableDevice(device);
          setSelectedMutableState(null);
          setMutableDevicesModal(false);
        }}
        onClose={() => setMutableDevicesModal(false)}
      />

      <ListModal
        visible={statesModal}
        data={states}
        onSelect={(state) => {
          setSelectedMutableState(state);
          setStatesModal(false);
        }}
        onClose={() => setStatesModal(false)}
        title="Select State"
        setTriggerValue={setTriggerValue}
        triggerValue={triggerValue}
      />

      <ListModal
        visible={commandDevicesModal}
        data={commandDevices}
        onSelect={(device) => {
          setSelectedCommandDevice(device);
          setSelectedCommandAction(null);
          setCommandDevicesModal(false);
        }}
        onClose={() => setCommandDevicesModal(false)}
      />

      <ListModal
        visible={commandsModal}
        data={commands}
        onSelect={(cmd) => {
          setSelectedCommandAction(cmd);
          setCommandsModal(false);
        }}
        onClose={() => setCommandsModal(false)}
        title="Select Command"
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
    marginBottom: 15,
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
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
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
