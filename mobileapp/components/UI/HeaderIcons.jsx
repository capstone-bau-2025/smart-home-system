import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

//component to render the 3 icons in the header of the app
export default function HeaderIcons({
  onInfoPress,
  onCogPress,
  onAddPress,
  custompadding,
  cogHidden,
}) {
  return (
    <View
    style={[
      styles.iconsContainer,
      custompadding && {
        paddingRight: 10,
        paddingLeft: cogHidden ? 50 : 10,
      },
    ]}
    >
      <TouchableOpacity onPress={onAddPress}>
        <Ionicons name="add-circle-outline" size={40} color="black" />
      </TouchableOpacity>

      {!cogHidden && (
        <TouchableOpacity onPress={onCogPress}>
          <Ionicons name="cog-outline" size={40} color="black" />
        </TouchableOpacity>
      )}

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
  },
  customPadding: {
    paddingRight: 10,
    paddingLeft: 10,
  },
});
