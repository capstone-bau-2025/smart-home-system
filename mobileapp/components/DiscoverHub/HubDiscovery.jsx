import { Modal, StyleSheet, Text, View,SafeAreaView } from 'react-native'
import React from 'react'
import DiscoverCard from './DiscoverCard'

export default function HubDiscovery() {
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