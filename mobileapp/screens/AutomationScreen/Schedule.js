import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Schedule() {
  return (
    <View style={styles.container}>
      <Text>Schedule</Text>
    </View>
  )
}

const styles = StyleSheet.create({  container:{
  flex:1,
  justifyContent:'center',
  alignContent:'center'
}})