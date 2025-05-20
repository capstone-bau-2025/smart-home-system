import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import SaveButton from "../../../components/UI/SaveButton";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setScheduledTime, setTriggerType, setEventId,setDeviceId,setStateValueId,setStateTriggerValue,setCooldownDuration} from "../../../store/slices/automationSlice";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";


export default function Schedule({ route }) {
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === "ios");

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const handleChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) setTime(selectedDate);
  };

  const handleSave = () => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const formattedTime = `${hours}:${minutes}`;
    
    console.log("Saved Time:", formattedTime);
    dispatch(setScheduledTime(formattedTime));
    dispatch(setTriggerType("SCHEDULE"));
    dispatch(setEventId(null));
    dispatch(setDeviceId(null));
    dispatch(setStateValueId(null));
    dispatch(setStateTriggerValue(null));
    dispatch(setCooldownDuration(0));
    
        Toast.show({
          type: "success",
          text1: "Type selected",
          text2: "Automation type has been set to Schedule.",
          position: "top",
          topOffset: 60,
          swipeable: true,
        });
    
    navigation.goBack();
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${mins}`;
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Ionicons name="alarm-outline" size={24} color="#3e914f" />
          </View>
          <Text style={styles.title}>Schedule Time</Text>
        </View>
      <Text style={styles.label}>Select time in hours and minutes</Text>

      {Platform.OS === "android" && (
        <>
          <Text style={styles.selectedTime}>{formatTime(time)}</Text>
          <Pressable
            onPress={() => setShowPicker(true)}
            style={({ pressed }) => [
              styles.button,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.buttonText}>Choose time</Text>
          </Pressable>
        </>
      )}

      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
      
          display="spinner"
          onChange={handleChange}
        />
      )}

      <SaveButton onPress={handleSave} color="#3e914f"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fefefe",
  },
  label: {
    fontSize: 22,
    fontFamily: "Lexend-Regular",
    marginBottom: 10,
    textAlign: "center",
  },
  selectedTime: {
    fontSize: 22,
    marginBottom: 10,
    fontFamily: "Lexend-Bold",
  },
  button: {
    backgroundColor: "#27d64d",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
    header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },
  iconWrapper: {
    backgroundColor: "#eaffea",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
    title: {
    fontSize: 28,
    fontFamily: "Lexend-Bold",
    textAlign: "center",
    color: "#333",
    
  },
});
