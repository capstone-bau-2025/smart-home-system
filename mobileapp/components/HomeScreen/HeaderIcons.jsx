import { View, Pressable, StyleSheet, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderIcons({ onInfoPress, onCogPress, onAddPress }) {
  return (
    <View style={styles.iconsContainer}>
      <TouchableOpacity onPress={onAddPress} style={({ pressed }) => [pressed && styles.pressed]}>
        <Ionicons name="add-circle-outline" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onCogPress} style={({ pressed }) => [pressed && styles.pressed]}>
        <Ionicons name="cog-outline" size={35} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onInfoPress} style={({ pressed }) => [pressed && styles.pressed]}>
        <Ionicons name="information-circle-outline" size={35} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  iconsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  pressed: {
    opacity: 0.7,
  },
});
