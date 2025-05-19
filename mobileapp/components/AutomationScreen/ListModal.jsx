import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
  TextInput,
} from "react-native";
import React, { useState } from "react";

export default function ListModal({
  visible,
  data = [],
  onSelect,
  onClose,
  title = "Select Device",
  setTriggerValue,
  triggerValue,
}) {
  const [activeItem, setActiveItem] = useState(null);
const handleSelect = (item) => {
  if (Array.isArray(item.choices) && item.choices.length > 0) {
    if (!activeItem || activeItem.id !== item.id || !triggerValue || !item.choices.includes(triggerValue)) {
      alert("Please select a valid option.");
      return;
    }

    onSelect({ ...item, value: triggerValue });
    setTriggerValue("");
    setActiveItem(null);
    onClose();
    return;
  }

  if (item.minRange != null && item.maxRange != null) {
    if (!activeItem || activeItem.id !== item.id || triggerValue === "") {
      alert("Please enter a number.");
      return;
    }

    const numericValue = Number(triggerValue);
    if (isNaN(numericValue)) {
      alert("Value must be a number.");
      return;
    }

    if (numericValue < item.minRange || numericValue > item.maxRange) {
      alert(`Enter a value between ${item.minRange} and ${item.maxRange}`);
      return;
    }

    onSelect({ ...item, value: numericValue });
    setTriggerValue("");
    setActiveItem(null);
    onClose();
    return;
  }

  
  onSelect(item);
  onClose();
};

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>

          <FlatList
            data={data}
            keyExtractor={(item, index) =>
              item?.id?.toString() || index.toString()
            }
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceName}>{item.name}</Text>

                  {Array.isArray(item.choices) && item.choices.length > 0 ? (
                    <View style={styles.choicesContainer}>
                      {item.choices.map((choice, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.choiceButton,
                            activeItem?.id === item.id &&
                            triggerValue === choice && styles.choiceButtonActive,
                          ]}
                          onPress={() => {
                            setActiveItem(item);
                            setTriggerValue(choice);
                          }}
                        >
                          <Text style={styles.choiceText}>{choice}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : item.minRange != null && item.maxRange != null ? (
                    <View style={styles.rangeContainer}>
                      <Text style={styles.rangeText}>
                        Min: {item.minRange} | Max: {item.maxRange}
                      </Text>
                      <TextInput
                        placeholder="Value"
                        keyboardType="numeric"
                        style={styles.input}
                        value={activeItem?.id === item.id ? triggerValue : ""}
                        onChangeText={(text) => {
                          setActiveItem(item);
                          setTriggerValue(text);
                        }}
                      />
                    </View>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.selectText}>Select</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 24,
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    maxHeight: "80%",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  deviceName: {
    fontSize: 20,
    flex: 1,
  },
  selectButton: {
    backgroundColor: "#fcae11",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  selectText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 24,
    alignSelf: "center",
  },
  closeText: {
    fontSize: 18,
    color: "gray",
  },
  rangeContainer: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rangeText: {
    fontSize: 14,
    color: "#555",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 60,
    fontSize: 16,
  },
  choicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 6,
  },
  choiceButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  choiceButtonActive: {
    backgroundColor: "#fcae11",
  },
  choiceText: {
    fontSize: 14,
    color: "#333",
  },
});
