import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DeviceCard from './DeviceCard'


//the devices in the top header of the homescreen (thermo + hub)
export default function HeaderDevices() {
  
  const headerCards = {

    thermostat:{
      id: "dev3",
      name: "Thermostat",
      category:"thermometer",
      reading:"23°C",
    },
    hubConnection:{
      id:'dev4',
      name: "Hub Status",
      category:"hub",
      type:"hub",
      status:"connected",
    }



  }
  return (
    
    <View style={styles.container}>
      {/* <DeviceCard data={headerCards.thermostat} />
      <DeviceCard data={headerCards.hubConnection}/> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    width:"50%",
    flexDirection:"row",
    justifyContent:"space-between",
    
  }
})