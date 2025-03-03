import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import OvalButton from '../../components/UI/OvalButton'
import { useContext } from 'react'
import { AuthContext } from '../../store/auth-context'

export default function ProfileScreen({}) {
    const {logout} = useContext(AuthContext)
  
  return (
    <View style={styles.container}>
    <OvalButton text={"Logout"} color="black" onPress={logout}/>
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