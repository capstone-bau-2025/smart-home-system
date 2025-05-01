import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import DeviceCard from './DeviceCard';


//holds the rooms and devices under them
export default function RoomCard({ data }) {
  const leftColumn = [];
  const rightColumn = [];
  let leftHeight = 0;
  let rightHeight = 0;

  const getDeviceHeight = (device) =>
    device.type === 'enum' || device.type === 'range' ? 135 : 60;

  // data.devices.forEach((device) => {
  //   const estimatedHeight = getDeviceHeight(device);

  //   if (leftHeight <= rightHeight) {
  //     leftColumn.push(device);
  //     leftHeight += estimatedHeight;
  //   } else {
  //     rightColumn.push(device);
  //     rightHeight += estimatedHeight;
  //   }
  // });

  return (
    <View style={styles.entireRoom}>
      {/* Room Header */}
      <View style={styles.roomHeader}>
        <Ionicons name='car-outline' style={styles.icon} size={25} />
        <Text style={styles.roomName}>{data.name}</Text>
      </View>

      {/* Balanced Two Column Layout */}
      <View style={styles.twoColumnGrid}>
        <View style={styles.column}>
          {leftColumn.map((device) => (
            <DeviceCard key={device.id} data={device} />
          ))}
        </View>
        <View style={styles.column}>
          {rightColumn.map((device) => (
            <DeviceCard key={device.id} data={device} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  entireRoom: {
    marginBottom: 5,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 10,
  },
  roomName: {
    fontSize: 20,
    fontFamily: 'Lexend-Regular',
  },
  twoColumnGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    width: '48%',
  },
});
