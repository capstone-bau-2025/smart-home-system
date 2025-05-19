import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';

export default function SaveButton({ onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && { opacity: 0.7 }]}>
      <Text style={styles.text}>Save</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fcae11',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
