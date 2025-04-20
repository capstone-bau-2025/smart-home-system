import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import FullScreenModal from '../UI/FullScreenModal';
import EditInput from '../UI/EditInput';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
export default function AddRoomModal({ visible, onClose, title,onSave }) {
  const [roomName, setRoomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);

  const iconOptions = [

      // 'sofa-outline',           
      // 'bed-outline',            
      // 'table-chair',            
      // 'toilet',                
      // 'shower-head',           
      // 'wardrobe-outline',      
      // 'ceiling-light-outline',
      // 'desk-lamp',              
      // 'television-outline',     
      // 'fridge-outline',  
   
      'home-outline',
      'bed-outline',
      'tv-outline',
      'water-outline',
      'restaurant-outline',
      'desktop-outline',
      'cafe-outline',
      'car-outline',
      'leaf-outline',
      'game-controller-outline',
    
  ];

  const renderIcon = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.iconBox,
        selectedIcon === item && styles.selectedIconBox,
      ]}
      onPress={() => setSelectedIcon(item)}
    >
      <Ionicons 
        name={item}
        size={30}
        color={selectedIcon === item ? '#fff' : '#444'}
      />
    </TouchableOpacity>
  );

  return (
    <FullScreenModal onClose={onClose} visible={visible} title={title}>
      <View style={styles.container}>
        <EditInput
          title={'Room name'}
          value={roomName}
          setChange={(value) => setRoomName(value)}
          placeholder={'bedroom, kitchen, living room, etc...'}
        />

        <Text style={styles.sectionTitle}>Choose Icon</Text>
        <FlatList
          data={iconOptions}
          renderItem={renderIcon}
          keyExtractor={(item) => item}
          numColumns={5}
          contentContainerStyle={styles.iconGrid}
          style={{ maxHeight: '70%' }} 
        />

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 10,
    fontFamily: 'Lexend-Regular',
  },
  iconGrid: {
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    backgroundColor: '#eee',
    padding: 12,
    margin: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  selectedIconBox: {
    backgroundColor: 'orange'
  },
  saveButton: {
    backgroundColor: 'orange',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop:20
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
  },
});
