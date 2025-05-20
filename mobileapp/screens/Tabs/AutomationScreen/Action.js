import {
  StyleSheet,
  Text,
  View,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Alert,
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
  const [mutableDevicesModal, setMutableDevicesModal] = useState(false);
  const [statesModal, setStatesModal] = useState(false);
  const [commandDevicesModal, setCommandDevicesModal] = useState(false);
  const [commandsModal, setCommandsModal] = useState(false);

  const [selectedMutableDevice, setSelectedMutableDevice] = useState(null);
  const [selectedCommandDevice, setSelectedCommandDevice] = useState(null);
  const [triggerValue, setTriggerValue] = useState(null);

  const [mutableDevices, setMutableDevices] = useState([]);
  const [commandDevices, setCommandDevices] = useState([]);
  const [states, setStates] = useState([]);
  const [commands, setCommands] = useState([]);

  const [localActions, setLocalActions] = useState([]);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  function reset() {
    setSelectedMutableDevice(null);
    setSelectedCommandDevice(null);
    setLocalActions([]);
  }

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

  useEffect(() => {
    if (selectedCommandDevice) {
      (async () => {
        try {
          const result = await getCommandsByDeviceId(
            selectedCommandDevice.id,
            "COMMAND"
          );
          setCommands(result);
        } catch (err) {
          console.error("❌ Failed to fetch commands:", err);
        }
      })();
    }
  }, [selectedCommandDevice]);

  const handleSave = () => {
    if (localActions.length === 0) {
      Toast.show({
        type: "error",
        text1: "No actions selected",
        topOffset: 60,
      });
      return;
    }

    dispatch(setActions(localActions));
    Toast.show({
      type: "success",
      text1: "Action(s) saved",
      text2: "Action(s) have been saved successfully.",
      position: "top",
      topOffset: 60,
    });
    navigation.goBack();
  };

  const renderSummary = () => {
    return localActions.length > 0 ? (
      localActions.map((action) => {
        const key =
          action.type === "STATE_UPDATE"
            ? `state-${action.deviceId}-${action.stateValueId}`
            : `cmd-${action.deviceId}-${action.commandId}`;

        const deviceList =
          action.type === "STATE_UPDATE" ? mutableDevices : commandDevices;

        return (
          <Text key={key} style={styles.selected}>
            {action.type === "STATE_UPDATE"
              ? `💡 ${
                  deviceList.find((d) => d.id === action.deviceId)?.name ||
                  "Device"
                } → ${action.actionValue}`
              : `⚙️ ${
                  deviceList.find((d) => d.id === action.deviceId)?.name ||
                  "Device"
                } → CMD ${action.commandId}`}
          </Text>
        );
      })
    ) : (
      <Text style={styles.selected}>No actions added</Text>
    );
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
        <Text style={styles.infoText}>
          Select devices and their actions. You can add both state and
          command-based actions.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Add Mutable Device Action</Text>
          <Pressable
            style={styles.inlineButton}
            onPress={() => setMutableDevicesModal(true)}
          >
            <Text style={styles.buttonText}>Select Device</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Add Command Device Action</Text>
          <Pressable
            style={styles.inlineButton}
            onPress={() => setCommandDevicesModal(true)}
          >
            <Text style={styles.buttonText}>Select Device</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.summaryHeader}>
            <Text style={styles.label}>Actions Summary</Text>
            <Pressable
              onPress={reset}
              style={({ pressed }) =>
                pressed
                  ? [styles.resetButton, { opacity: 0.8 }]
                  : styles.resetButton
              }
            >
              <Text style={styles.resetButtonText}>Reset</Text>
              <Ionicons name="trash-outline" size={20} color="red" />
            </Pressable>
          </View>
          {renderSummary()}
        </View>

        <View style={styles.footer}>
          <SaveButton onPress={handleSave} color="#1150fc" />
        </View>
      </ScrollView>

      {/* Mutable Modal */}
      <ListModal
        visible={mutableDevicesModal}
        data={mutableDevices}
        onSelect={async (device) => {
          try {
            const result = await getStateValuesByDeviceId(device.id, "MUTABLE");
            const used = localActions.map((a) => a.stateValueId);
            const filtered = result.filter((s) => !used.includes(s.id));

            if (filtered.length === 0) {
              Toast.show({
                type: "error",
                text1: "No available states for this device",
                text2: "Please select another device.",
                topOffset: 60,
              });
              return;
            }

            setSelectedMutableDevice(device);
            setStates(filtered);
            setStatesModal(true);
            setMutableDevicesModal(false);
          } catch (err) {
            console.error("❌ Failed to load states:", err);
          }
        }}
        onClose={() => setMutableDevicesModal(false)}
        title="Select Mutable Device"
        buttonColor="#1150fc"
      />

      <ListModal
        visible={statesModal}
        data={states}
        onSelect={(state) => {
          const action = {
            type: "STATE_UPDATE",
            deviceId: selectedMutableDevice.id,
            stateValueId: state.id,
            actionValue: state.value,
          };
          setLocalActions((prev) => [...prev, action]);
          setStatesModal(false);
        }}
        onClose={() => setStatesModal(false)}
        title="Select State"
        setTriggerValue={setTriggerValue}
        triggerValue={triggerValue}
        buttonColor="#1150fc"
        choiceButtonColor="#a3aaffe2"
      />

      {/* Command Modal */}
      <ListModal
        visible={commandDevicesModal}
        data={commandDevices}
        onSelect={async (device) => {
          try {
            const result = await getCommandsByDeviceId(device.id, "COMMAND");
            const used = localActions.map((a) => a.commandId);
            const filtered = result.filter((c) => !used.includes(c.id));

            if (filtered.length === 0) {
              Toast.show({
                type: "error",
                text1: "No available commands",
                text2: "Please select another device.",
                topOffset: 60,
              });
              return;
            }

            setSelectedCommandDevice(device);
            setCommands(filtered);
            setCommandsModal(true);
            setCommandDevicesModal(false);
          } catch (err) {
            console.error("❌ Failed to load commands:", err);
          }
        }}
        onClose={() => setCommandDevicesModal(false)}
        title="Select Command Device"
        buttonColor="#1150fc"
        choiceButtonColor="#a2b7f1"
      />

      <ListModal
        visible={commandsModal}
        data={commands}
        onSelect={(cmd) => {
          const action = {
            type: "COMMAND",
            deviceId: selectedCommandDevice.id,
            commandId: cmd.id,
          };
          setLocalActions((prev) => [...prev, action]);
          setCommandsModal(false);
        }}
        onClose={() => setCommandsModal(false)}
        title="Select Command"
        buttonColor="#1150fc"
        choiceButtonColor="#a2b7f1"
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
    backgroundColor: "#1150fc",
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
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    color: "#000",
    marginTop: 5,
  },
  footer: {
    marginTop: 20,
    width: "90%",
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
    marginRight: 10,
  },
  infoText: {
    fontFamily: "Lexend-Regular",
    fontSize: 15,
    textAlign: "left",
    marginBottom: 10,
    left: 10,
    color: "#797979",
    paddingHorizontal: 20,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "99%",
    marginBottom: 15,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 10,
    borderRadius: 10,
  },
  resetButtonText: {
    color: "#721c24",
    fontFamily: "Lexend-Bold",
    marginRight: 5,
  },
});
