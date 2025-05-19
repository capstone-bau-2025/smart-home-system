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
}) {
  const [rangeValue, setRangeValue] = useState("");
  const [activeItem, setActiveItem] = useState(null);

  const handleSelect = (item) => {
    if (item.min != null && item.max != null) {
      const numericValue = Number(rangeValue);
      if (
        !isNaN(numericValue) &&
        numericValue >= item.min &&
        numericValue <= item.max
      ) {
        onSelect({ ...item, value: numericValue });
        setRangeValue("");
        setActiveItem(null);
        onClose();
      } else {
        alert(`Enter a value between ${item.min} and ${item.max}`);
      }
    } else {
      onSelect(item);
      onClose();
    }
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
            keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  {item.min != null && item.max != null && (
                    <View style={styles.rangeContainer}>
                      <Text style={styles.rangeText}>
                        Min: {item.min} | Max: {item.max}
                      </Text>
                      <TextInput
                        placeholder="Value"
                        keyboardType="numeric"
                        style={styles.input}
                        value={
                          activeItem?.id === item.id ? rangeValue : ""
                        }
                        onChangeText={(text) => {
                          setActiveItem(item);
                          setRangeValue(text);
                        }}
                      />
                    </View>
                  )}
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
});
