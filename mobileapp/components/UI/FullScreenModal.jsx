import React, { use, useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, Platform } from "react-native";

import Colors from "../../constants/Colors";

// A component that renders a full screen modal with a title and a close button
export default function FullScreenModal({ visible, onClose, children, title }) {
  return (
    <Modal animationType="slide" transparent={false} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>close</Text>
          </TouchableOpacity>
        </View>
        {/* 
      <View style={styles.headerIcons}>
          <HeaderIcons  onInfoPress={() => setInfoModal(true)}/>
        
      </View> */}
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    paddingTop: Platform.OS === "android" ? 15 : 60,
    alignItems: "center",
    
    
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#c1c1c1",
  },
  closeButton: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e19b19",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#e19b19",
  },
});
