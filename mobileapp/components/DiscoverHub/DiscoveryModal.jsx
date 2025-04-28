import { Pressable, StyleSheet, Text, View } from "react-native";
import { configureHub } from "../../api/services/hubService";
import FullScreenModal from "../UI/FullScreenModal";
import { useState } from "react";
import EditInput from "../UI/EditInput";
import { Ionicons } from "@expo/vector-icons";

//modal that opens when hub card is pressed
export default function DiscoveryModal({
  visible,
  onClose,
  title,
  selectedHub,
}) {
  const [value, setValue] = useState("");

  const handleConfigureHub = async () => {
    if (selectedHub && value.trim()) {
      try {
        const result = await configureHub(value);
        console.log("Hub configured successfully:", result);

        onClose();
      } catch (error) {
        console.log("Failed to configure hub:", error);
      }
    } else {
      console.log("Hub name is required");
    }
  };
  return (
    <FullScreenModal visible={visible} onClose={onClose} title={title}>
      {selectedHub?.discovered ? (
        <>
          <View style={styles.container}>
            <Ionicons
              name="help-circle-outline"
              size={70}
              style={styles.icon}
            />
            <Text style={styles.infoText}>
              To connect to this hub you need to enter an invitation code
              provided by the admin of this hub
            </Text>
            <View style={styles.input}>
              <EditInput
                placeholder={"enter code"}
                title={"Invitation code"}
                setChange={setValue}
                value={value}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.pressed,
                ]}
                onPress={() => console.log("pressed")}
              >
                <Text style={styles.text}>confirm</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Ionicons
              name="information-circle-outline"
              size={70}
              style={styles.icon}
            />
            <Text style={styles.infoText}>
              This hub haven't been configured yet, to configure it enter a name
            </Text>
            <View style={styles.input}>
              <EditInput
                placeholder={"enter name"}
                title={"Enter hub name"}
                setChange={setValue}
                value={value}
                validationMessage={
                  value.trim().length === 0 ? "This field is required" : ""
                }
              />
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.pressed,
                ]}
                onPress={handleConfigureHub}
              >
                <Text style={styles.text}>continue</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
  },
  infoText: {
    fontSize: 20,
    fontFamily: "Lexend-Regular",
    color: "#000000",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    width: "90%",
    alignItems: "center",
  },
  icon: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#e19b19",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
    marginTop:10
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
