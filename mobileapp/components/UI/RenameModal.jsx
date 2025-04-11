import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MidModal from './MidModal'
import EditInput from '../UI/EditInput'
export default function RenameModal({visible,onClose}) {

  return (
  <MidModal visible={visible} onClose={onClose} cancelLabel={"Close"}  confirmLabel={"Save"}>
    <EditInput placeholder={"new user name"} title={"Enter a new name"} />
  </MidModal>
  )
}

const styles = StyleSheet.create({
  
})