import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { homeHub } from "../../Data/homehub";
import { useState, useEffect } from "react";
import { fetchRooms } from "../../api/services/areaService";
import RoomCard from "./RoomCard";
import HubConnectionCard from "./HubConnectionCard";

//this is the feed that shows the rooms and devices in the home hub
export default function Home({ data, onRefresh, refreshing }) {
  //data here is the rooms that are fetched from the api

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 15 }}
        ListHeaderComponent={() => (
          <View>
            <HubConnectionCard />
          </View>
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        renderItem={({ item }) => (
          <>
            <RoomCard data={item} />
          </>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              alignItems: "center",
              marginTop: 20,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ fontSize: 16, color: "#555", textAlign: "center" }}>
              No Hub found — try connecting to one from the "Discover Hub"
              screen.
            </Text>
          </View>
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
