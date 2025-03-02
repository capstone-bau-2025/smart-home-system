import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OvalButton from '../components/UI/OvalButton'

export default function ProfileScreen({screensHandler}) {
  return (
    <View style={styles.container}>
    <OvalButton text={"Logout"} color="black"   onPress={screensHandler}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  }
})