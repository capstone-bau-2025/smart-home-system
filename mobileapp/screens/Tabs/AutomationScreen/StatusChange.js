import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function StatusChange() {
  return (
    <View style={styles.container}>
      <Text>StatusChange</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignContent:'center'
  }
})