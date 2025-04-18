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
          <Pressable
            style={({ pressed }) => [
              styles.itemContainer,
              pressed && styles.pressed,
            ]}
            onPress={() => handlePress(item)}
          >
            <View style={styles.textContainer}>
              <Text
                style={styles.pressableItemText}
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
                  onPress={() => {
                    onPress(item);
                  }}
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
                  onValueChange={() => {
                    toggleSwitch(item.id);
                  }}
                  value={isEnabled}
                  style={Platform.OS === "android" ? styles.switch : undefined}
                />
              )}
            </View>
          </Pressable>
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
    flexGrow: 1,
    paddingBottom: 20,
  },

  itemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 8,
      marginVertical: 10,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 20,
      borderTopLeftRadius: 30,
      borderBottomLeftRadius: 0,
      width: "90%",
      alignSelf: "center",
      backgroundColor: "#fdf7f7",
      borderWidth: 2,
      borderColor: "orange",
      //borderBottomColor:'black',
      //borderLeftColor:'black'
  },

  textContainer: {
    flex: 1,
    paddingRight: 1,
  },

  itemText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flexWrap: "wrap",
    
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  button: {
    marginHorizontal: 5,
    padding: 8,
    backgroundColor: "orange",
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
  pressableItemText:{
    fontSize: 25,
    fontFamily: "Lexend-Regular",
    color: "#000",
    flexWrap: "wrap",
  }
});
