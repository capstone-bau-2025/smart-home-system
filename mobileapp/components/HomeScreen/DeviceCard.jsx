import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import CustomSlider from "./CustomSlider";
import {
  getIconBgColor,
  getIconName,
  getIconColor,
} from "../../util/helperFunctions";
import { useSelector } from "react-redux";

//the device card thats in the homescreen
export default function DeviceCard({ data }) {

  const [state, setState] = useState("Off");
  const [value, setValue] = useState(0);
  const devices = useSelector((state) => state.devices.devices);
  console.log(devices)
  const isSlider = data.type === "enum" || data.type === "range";
  const isHub = data.type === "hub";
  const isThermostat = data.category === "thermometer";
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        isSlider ? styles.tallCard : styles.shortCard,
        pressed && !isHub && !isThermostat ? styles.pressed : null,
      ]}
      onPress={() => {
        if (!isHub && !isThermostat) {
          setState((prev) => (prev === "On" ? "Off" : "On"));
        }
      }}
    >
      <View style={styles.rowTop}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: getIconBgColor(data.category) },
          ]}
        >
          <Ionicons
            name={getIconName(data.category)}
            size={20}
            color={getIconColor(data.category)}
          />
        </View>

        <View style={styles.labelBlock}>
          <Text
            style={styles.deviceName}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {data.name}
          </Text>
          <Text
            style={[
              styles.status,
              {
                color:
                  isHub || isThermostat
                    ? "#8b8b8b"
                    : state === "On"
                    ? "green"
                    : "red",
              },

            ]}
          >
            {isHub || isThermostat ? null : state}
            {isSlider ? ` - ${value}` : ""}
            {isHub ? `${data.status}` : ""}
            {isThermostat ? `${data.reading}` : ""}
          </Text>
        </View>
      </View>

      {isSlider && (
        <CustomSlider
          levels={data.choices || ["Low", "Medium", "High"]}
          ranged={data.type === "range"}
          minRange={data.range?.[0]}
          maxRange={data.range?.[1]}
          value={value}
          setValue={setValue}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    overflow: "hidden",
    marginRight: 15,
    borderWidth: 1,
    borderColor: "#b1b1b163",
  },
  shortCard: {
    height: 60,
    maxHeight: 60,
  },
  tallCard: {
    height: 135,
    maxHeight: 135,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelBlock: {
    marginLeft: 10,
    flex: 1,
    overflow: "hidden",
  },
  iconWrapper: {
    borderRadius: 50,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  deviceName: {
    fontFamily: "Lexend-Regular",
    fontSize: 14,
    color: "#000",
  },
  status: {
    fontSize: 12,
    color: "#666",
    fontFamily: "Lexend-Regular",
  },
  pressed: {
    opacity: 0.7,
  },
});
