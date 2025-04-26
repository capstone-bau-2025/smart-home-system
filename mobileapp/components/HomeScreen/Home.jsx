import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { homeHub } from "../../Data/homehub";

import RoomCard from "./RoomCard";

import HeaderDevices from "./HeaderDevices";

//this is the feed that shows the rooms and devices in the home hub
export default function Home() {
  return (
    <View style={styles.container}>
      <FlatList
        data={homeHub.rooms}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 15 }}
        ListHeaderComponent={() => (
          <View>
            <HeaderDevices />
          </View>
        )}
        renderItem={({ item }) => (
          <>
            <RoomCard data={item} />
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    padding: 20,
  },
  icon: {
    marginRight: 10,
  },
  roomName: {
    fontSize: 20,
    fontFamily: "Lexend-Regular",
  },
  room: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
  },
  type: {
    color: "#000",
  },
});
