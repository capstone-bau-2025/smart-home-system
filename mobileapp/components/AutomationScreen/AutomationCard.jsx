import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

export default function AutomationCard({ handleToggleAutomation, item, setModalVisible, setCurrentAutomation }) {
  const [isEnabled, setIsEnabled] = useState(item.status === "Active");

  function handlePress() {
    setCurrentAutomation(item);
    setModalVisible(true);
  }

  const toggleSwitch = () => {
    setIsEnabled((prev) => !prev);
    handleToggleAutomation(item.id); 
  };

  return (
    <Pressable style={({ pressed }) => (pressed ? styles.pressed : null)} onPress={handlePress}>
      <View  style={styles.listsContainer}>
        
        <Text style={styles.text}>{item.name}</Text>

        <View style={styles.iconContainer}>

          <Switch
            trackColor={{ false: "#767577", true: "#34C759" }} 
            thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#a3a3a3"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={Platform.OS === "android" ? styles.switch : null}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  listsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginVertical: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 0,
    width: '90%',
    alignSelf: "center",
    backgroundColor:'#ffffff',
    borderWidth:2,
    borderColor:'orange'
  },
  text: {
    color: "black",
    fontSize: 24,
    fontFamily: "Lexend-Regular",
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
});
