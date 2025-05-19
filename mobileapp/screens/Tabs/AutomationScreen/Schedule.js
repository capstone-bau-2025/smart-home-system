import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import SaveButton from "../../../components/UI/SaveButton";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  setSelectedTime,
  setType,
} from "../../../store/slices/automationSlice";
import { setScheduledTime, setTriggerType, setEventId,setDeviceId,setStateValueId,setStateTriggerValue} from "../../../store/slices/automationSlice";
import Toast from "react-native-toast-message";


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

      <SaveButton onPress={handleSave} />
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
    fontFamily: "Lexend-Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  selectedTime: {
    fontSize: 22,
    marginBottom: 10,
    fontFamily: "Lexend-Bold",
  },
  button: {
    backgroundColor: "#fcae11",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
