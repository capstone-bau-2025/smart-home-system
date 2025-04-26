import { Modal, StyleSheet, Text, View,SafeAreaView,StatusBar,Platform } from 'react-native'
import React from 'react'
import DiscoverCard from '../../../components/DiscoverHub/DiscoverCard'

export default function DiscoverHub() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Scanned Hubs</Text>
      <DiscoverCard/>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    justifyContent: 'center',
    alignItems: 'center', 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 50 : 0,
  },
  title:{
    fontSize: 27,
    fontWeight: 'bold',
    justifyContent:'center',
    alignContent:'center',
    color:'#000000',
    marginBottom:10
  }
})