import { StyleSheet, Text, View, Pressable } from "react-native";


//simple oval shaped button used in register and login 
export default function OvalButton({ text, icon, color,onPress }) {
  return (
    <Pressable
      style={({ pressed }) =>
        pressed
          ? [styles.container, { backgroundColor: color }, styles.pressed]
          : [styles.container, { backgroundColor: color }]
      }
      onPress={onPress}
    >
      <View style={styles.content}>
      
        <Text style={styles.text}>{text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 311,
    height: 48,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    
  },
  pressed: {
    opacity: 0.75,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    fontFamily: "Lexend-Regular", 
  },
});
