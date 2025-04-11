import React, { useState } from "react";
import { StyleSheet, Text, View, Switch, } from "react-native";

export default function Switch() {
  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>

      <Switch
        trackColor={{ false: "#767577", true: "#34C759" }} 
        onValueChange={toggleSwitch}
        value={isEnabled}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

});
