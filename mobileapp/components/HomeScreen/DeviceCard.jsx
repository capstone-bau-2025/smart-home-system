import { StyleSheet, Text, View, Pressable, Modal } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  getIconBgColor,
  getIconName,
  getIconColor,
} from "../../util/helperFunctions";
import DeviceModal from "./DeviceModal"; 

export default function DeviceCard({ data }) {
  const [modalVisible, setModalVisible] = useState(false);

  // Use the first interaction (if any) as a preview on the card
  const preview = data.interactions?.[0];
  const previewValue = preview?.value ?? "";
  const previewType = preview?.type ?? "";
  const isSlider = previewType === "RANGE";
  const displayValue = typeof previewValue === "string" ? previewValue : String(previewValue);

  return (
    <>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          isSlider ? styles.tallCard : styles.shortCard,
          pressed ? styles.pressed : null,
        ]}
        onLongPress={() => setModalVisible(true)}
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
                    previewValue === "ON" || previewValue === "OPEN"
                      ? "green"
                      : previewValue === "OFF" || previewValue === "CLOSED"
                      ? "red"
                      : "#666",
                },
              ]}
            >
              {displayValue}
            </Text>
          </View>
        </View>
      </Pressable>

      <DeviceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={data}
      />
    </>
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
