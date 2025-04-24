  import React from "react";
  import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    TouchableWithoutFeedback,
    Platform
  } from "react-native";
  import { Ionicons } from "@expo/vector-icons";

  //a custom made dropdown modal that takes in data and displays it in a dropdown format (found in homescreen)
  export default function DropdownModal({
    visible,
    setVisible,
    data,
    onSelect,
    triposition,
    position
  }) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.dropdownContainer}>
                
              <View style={[styles.triangle, triposition]} />

          
                <View style={[styles.dropdown,position]}>
                  {data.map((item, index) => (
                    <Pressable
                      key={index}
                      style={({ pressed }) => [
                        styles.option,
                        pressed && styles.pressedOption,
                        index === 0 && styles.firstOption, 
                        index === data.length - 1 && styles.lastOption,
                      ]}
                      onPress={() => {
                        onSelect(item.value);
                        setVisible(false); 
                      }}
                    >
                      {item.icon && (
                        <Ionicons
                          name={item.icon}
                          size={20}
                          color="orange"
                          style={styles.optionIcon}
                        />
                      )}
                      <Text style={styles.optionText}>{item.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }


  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.2)", 
      justifyContent: "flex-start",
      alignItems: "flex-end",
      paddingTop: 60,
      paddingRight: 20,
    },
    dropdownContainer: {
      alignItems: "center",
    },
    triangle: {

      right: 15,
      width: 0,
      height: 0,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 10,
      borderStyle: "solid",
      backgroundColor: "transparent",
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "white", 
    },
    dropdown: {
      backgroundColor: "white",
      right: 70,
      borderRadius: 5,
      width: 200,
      elevation: 5,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 20,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    pressedOption: {
      backgroundColor: "#e0e0e0",
      paddingVertical: 20,
      paddingHorizontal: 20,
    },
    firstOption: {
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
    },
    lastOption: {
      borderBottomLeftRadius: 5,
      borderBottomRightRadius: 5,
    },
    optionText: {
      fontSize: 16,
      color: "#333",
      marginLeft: 10,
    },
    optionIcon: {
      marginRight: 5,
      
    },

  });
