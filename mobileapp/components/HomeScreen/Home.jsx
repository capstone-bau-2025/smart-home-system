import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { homeHub } from "../../Data/homehub";
import { useState,useEffect } from "react";
import { fetchRooms } from "../../api/services/areaService";
import RoomCard from "./RoomCard";
import HeaderDevices from "./HeaderDevices";



//this is the feed that shows the rooms and devices in the home hub
export default function Home() {


  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  


  // useEffect(() => {
  //   handleFetchRooms();
  // }, []);

  // const handleFetchRooms = async () => {
  //   setIsLoading(true);
  //   const result = await fetchRooms();
  //   if (result.success) {
  //     setRooms(result.data);
  //   } else {
  //     console.log("Fetch rooms error:", result.error);
  //   }
  //   setIsLoading(false);
  // };
  


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
            {/* fetched data (rooms) sent here */}
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
