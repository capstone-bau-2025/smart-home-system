import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Switch,
  Pressable,
  Platform,
} from "react-native";
import Colors from "../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function ScrollableList({
  data,
  textFields = [],
  buttonConfig = [],
  toggle,
  handlePress,
  toggleSwitch,
  pressableTab,
}) {
  if (!data || data.length === 0) {
    return <Text style={styles.emptyText}>No data found</Text>;
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const isEnabled = item.status === "Active";

        return pressableTab ? (
          <>
            <Pressable
              style={({ pressed }) => [
                styles.itemContainer,
                pressed && styles.pressed,
              ]}
              onPress={() => handlePress(item)}
            >
              <View style={styles.textContainer}>
                {textFields.map((field, index) => (
                  <Text
                    style={styles.pressableItemText}
                    numberOfLines={5}
                    ellipsizeMode="tail"
                    key={index}
                  >
                    {item[field]}
                  </Text>
                ))}
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color="#ccc"
                />
              </View>

              <View style={styles.buttonContainer}>
                {buttonConfig?.map((btn, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => btn.onPress(item)}
                    style={styles.button}
                  >
                    <Ionicons name={btn.icon} size={24} color="#000000" />
                  </TouchableOpacity>
                ))}

                {toggle && (
                  <Switch
                    trackColor={{ false: "#767577", true: "#34C759" }}
                    thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
                    ios_backgroundColor="#a3a3a3"
                    onValueChange={() => toggleSwitch(item.id)}
                    value={isEnabled}
                    style={
                      Platform.OS === "android" ? styles.switch : undefined
                    }
                  />
                )}
              </View>
            </Pressable>
          </>
        ) : (
          <View style={styles.itemContainer}>
            <View style={styles.textContainer}>
              <Text
                style={styles.itemText}
                numberOfLines={5}
                ellipsizeMode="tail"
              >
                {textFields.map((field, index) => (
                  <Text key={index}>
                    {item[field]}
                    {index < textFields.length - 1 ? " - " : ""}
                  </Text>
                ))}
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {buttonConfig?.map((btn, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => btn.onPress(item)}
                  style={styles.button}
                >
                  <Ionicons name={btn.icon} size={24} color="#000000" />
                </TouchableOpacity>
              ))}

              {toggle && (
                <Switch
                  trackColor={{ false: "#767577", true: "#34C759" }}
                  thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
                  ios_backgroundColor="#a3a3a3"
                  onValueChange={() => toggleSwitch(item.id)}
                  value={isEnabled}
                  style={Platform.OS === "android" ? styles.switch : undefined}
                />
              )}
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
    flex: 1,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,

    borderBottomWidth: 1,
    borderColor: "#c4c4c4",
    width: "90%",
    alignSelf: "center",
  },
  textContainer: {
    flex: 1,
    paddingRight: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 20,
    fontFamily: "Lexend-Regular",
    color: "#000",
    // flexWrap: "wrap",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  button: {
    marginHorizontal: 5,
    padding: 8,
    backgroundColor: Colors.primary100,
    borderRadius: 50,
  },
  pressed: {
    opacity: 0.7,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "gray",
  },
  pressableItemText: {
    fontSize: 24,
    fontFamily: "Lexend-Regular",
    color: "#000",
    flexWrap: "wrap",
  },
});
