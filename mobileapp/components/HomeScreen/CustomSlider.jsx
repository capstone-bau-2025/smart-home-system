import Slider from '@react-native-community/slider';
import { View, Text, StyleSheet, Platform } from 'react-native';
import React, { useState } from 'react';

export default function CustomSlider({ levels, ranged, choices, minRange, maxRange, value,setValue }) {


  return (
    <View style={styles.container}>
      
      <Slider
        style={{ width: '100%' }}
        minimumValue={ranged ? minRange : 1}
        maximumValue={ranged ? maxRange : (levels?.length ?? 3)}
        step={1}
        minimumTrackTintColor="#007AFF"
        maximumTrackTintColor={Platform.OS === 'android' ? '#000000' : '#dcd1d1'}
        thumbTintColor={Platform.OS === 'android' ? '#007AFF' : '#fff'}
        value={value}
        onValueChange={(val) => setValue(val)}
      />

      <View style={styles.labels}>
        {ranged ? (
          <>
            <Text style={styles.label}>{minRange}</Text>
            
            <Text style={styles.label}>{maxRange}</Text>
          </>
          
        ) : (
          levels.map((label, i) => (
            <Text key={i} style={styles.label}>{label}</Text>
          ))
        )}
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    padding: 10,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  label: {
    fontSize: 10,
  },
});
