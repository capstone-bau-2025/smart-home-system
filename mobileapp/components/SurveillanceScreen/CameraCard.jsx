import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';



export default function CameraCard({ camera, onPress }) {
  return (
    <Pressable style={styles.card} onPress={() => onPress(camera)}>
      <View style={styles.preview}>
        <Ionicons name="videocam-outline" size={90} color="#bbb" />
      </View>

      <View style={styles.infoRow}>
        <View>
          <Text style={styles.name}>{camera.name}</Text>
          <Text style={styles.details}>
            {camera.modelName} • {camera.type}
          </Text>
          <Text
            style={[
              styles.status,
              camera.status === 'CONNECTED' ? styles.connected : styles.disconnected,
            ]}
          >
            {camera.status}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={16} color="#aaa" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffc2597f',
    borderRadius: 8,
    margin: 10,
    width:170,
    overflow: 'hidden',
  },
  preview: {
    height: 120,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textDark || '#333',
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  status: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
  },
  connected: {
    color: '#28a745',
  },
  disconnected: {
    color: '#dc3545',
  },
});
