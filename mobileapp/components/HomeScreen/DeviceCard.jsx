import { StyleSheet, Text, View, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import CustomSlider from "./CustomSlider";
import {
  getIconBgColor,
  getIconName,
  getIconColor,
} from "../../util/helperFunctions";
import DeviceModal from "./DeviceModal";
import {
  updateInteractionState,
  executeInteractionCommand,
  fetchStateValue,
} from "../../api/services/interactionService";
import { getCustomName } from "../../util/interactionNames";

export default function DeviceCard({ data }) {
  const isInfo = data.type === "INFO";
  const isCommand = data.type === "COMMAND";
  const isChoice = data.type === "CHOICE";
  const isRange = data.type === "RANGE";
  const hasMultipleChoices = isChoice && data.choices?.length > 2;
  const isToggleChoice = isChoice && data.choices?.length <= 2;
  const isSlider = isRange || hasMultipleChoices;

  const [modalVisible, setModalVisible] = useState(false);
  const [value, setValue] = useState(data.value ?? "");
  const [index, setIndex] = useState(
    hasMultipleChoices ? data.choices?.indexOf(data.value) ?? 0 : 0
  );
  const [customName, setCustomNameState] = useState(null);
  const highlight = useSharedValue("white");
  const refreshName = async () => {
    const name = await getCustomName(data);
    if (name) setCustomNameState(name);
  };
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(highlight.value, { duration: 350 }),
  }));
  useEffect(() => {
    getCustomName(data).then((name) => {
      if (name) setCustomNameState(name);
    });
  }, [data.stateValueId, data.commandId]);
  const handleLongPress = () => {
    setModalVisible(true);
  };

  const handlePress = async () => {
    if (isToggleChoice) {
      const currentIndex = data.choices.findIndex((c) => c === value);
      const nextIndex = (currentIndex + 1) % data.choices.length;
      const newValue = data.choices[nextIndex];

      try {
        await updateInteractionState(data.stateValueId, newValue);
        setValue(newValue);
        highlight.value =
          newValue === "ON" || newValue === "OPEN" ? "#d4f8d4" : "#f8d4d4";

        setTimeout(() => {
          highlight.value = "white";
        }, 600);
      } catch (err) {
        console.warn("Toggle update failed:", err);
      }
    }

    if (isCommand) {
      try {
        await executeInteractionCommand(data.deviceId, data.commandId);
        highlight.value = "#d4f8d4";
        setTimeout(() => {
          highlight.value = "white";
        }, 600);
      } catch (err) {
        console.warn("Command failed:", err);
      }
    }
  };

  const getDynamicStyle = () => {
    if (isInfo) return styles.infoCard;
    if (isRange) return styles.rangeCard;
    if (hasMultipleChoices) return styles.multiChoiceCard;
    if (isToggleChoice) return styles.toggleCard;
    if (isCommand) return styles.commandCard;
    return {};
  };

  const renderStatusText = () => {
    if (isSlider) {
      return (
        <Text style={styles.status}>
          {isRange ? `${value}` : data.choices?.[index]}
        </Text>
      );
    }

    if (isInfo || isToggleChoice || isCommand) {
      return <Text style={styles.status}>{value}</Text>;
    }

    return null;
  };

  //   useEffect(() => {
  //   if (data?.stateValueId) {
  //     console.log('FETCHING STATE VALUE:', data.stateValueId);
  //     fetchStateValue(data.stateValueId)
  //       .then((res) => {
  //         if (isRange) {
  //           setValue(res.value.toString());
  //         } else if (isChoice) {
  //           setValue(res.value);
  //           const idx = data.choices.findIndex((c) => c === res.value);
  //           if (idx !== -1) setIndex(idx);
  //         }
  //       })
  //       .catch((err) => console.warn("Failed to fetch state value:", err));
  //   }
  // }, []);
  return (
    <>
      <Pressable
        onPress={!isInfo && (isToggleChoice || isCommand) ? handlePress : null}
        onLongPress={handleLongPress}
        style={({ pressed }) => (pressed ? styles.pressed : null)}
      >
        <Animated.View
          style={[
            styles.card,
            getDynamicStyle(),
            isSlider ? styles.tallCard : styles.shortCard,
            animatedStyle,
          ]}
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
                <Text style={styles.deviceName}>{customName || data.name}</Text>
              </Text>
              {renderStatusText()}
            </View>
          </View>

          {isSlider && (
            <CustomSlider
              levels={hasMultipleChoices ? data.choices : undefined}
              ranged={isRange}
              minRange={isRange ? parseFloat(data.min) : undefined}
              maxRange={isRange ? parseFloat(data.max) : undefined}
              value={isRange ? parseFloat(value) : index}
              setValue={async (val) => {
                if (isRange) {
                  const newVal = val.toString();
                  try {
                    await updateInteractionState(data.stateValueId, newVal);
                    setValue(newVal);
                    highlight.value = "#d4f8d4";
                    setTimeout(() => {
                      highlight.value = "white";
                    }, 600);
                  } catch (err) {
                    console.warn("Range update failed:", err);
                  }
                }
              }}
            />
          )}
        </Animated.View>
      </Pressable>

      <DeviceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        interaction={data}
        onRename={refreshName}
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
  infoCard: {
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  rangeCard: {
    borderColor: "#4f83cc",
  },
  multiChoiceCard: {
    borderColor: "#f39c12",
  },
  toggleCard: {
    borderColor: "#2ecc71",
  },
  commandCard: {
    borderColor: "#e74c3c",
  },
});
