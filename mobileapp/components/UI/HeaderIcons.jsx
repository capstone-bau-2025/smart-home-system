import { View, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderIcons({ onInfoPress, onCogPress, onAddPress }) {
  return (
    <View style={styles.iconsContainer}>
      <TouchableOpacity onPress={onAddPress}>
        <Ionicons name="add-circle-outline" size={40} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCogPress}>
        <Ionicons name="cog-outline" size={40} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onInfoPress}>
        <Ionicons name="information-circle-outline" size={40} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    flex: 1,
    paddingRight: 15,
    paddingVertical: 10,
  },
});
