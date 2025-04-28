import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import FullScreenModal from '../UI/FullScreenModal';
import EditInput from '../UI/EditInput';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addRoom } from '../../api/services/areaService';


// A modal that allows the user to add a room to the hub, it takes in a name and an icon
export default function AddRoomModal({ visible, onClose, title }) {
  const [roomName, setRoomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showRoomNameError, setShowRoomNameError] = useState(false);
  const [showIconError, setShowIconError] = useState(false);

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
      onPress={() => {
        setSelectedIcon(item);
        setShowIconError(false); 
      }}
    >
      <Ionicons 
        name={item}
        size={30}
        color={selectedIcon === item ? '#fff' : '#444'}
      />
    </TouchableOpacity>
  );

  async function handleSave() {
    let hasError = false;
    if (!roomName.trim()) {
      setShowRoomNameError(true);
      hasError = true;
    }
    if (!selectedIcon) {
      setShowIconError(true);
      hasError = true;
    }
    if (hasError) return;
  
    try {
      const result = await addRoom(roomName); 
  
      if (result.success) { 
        console.log('Room added successfully:', result);
        setRoomName('');
        setSelectedIcon(null);
        setShowRoomNameError(false);
        setShowIconError(false);
        onClose(); 
      } else {
        console.log('Failed to add room:', result.message);

      }
    } catch (error) {
      console.log('Error while adding room:', error.message);

    }
  }
  return (
    <FullScreenModal onClose={onClose} visible={visible} title={title}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <EditInput
            title={'Room name'}
            value={roomName}
            setChange={(value) => {
              setRoomName(value);
              if (value.trim()) setShowRoomNameError(false);
            }}
            placeholder={'bedroom, kitchen, living room, etc...'}
          />
          {showRoomNameError && (
            <Text style={styles.validationText}>Room name is required</Text>
          )}

          <Text style={styles.sectionTitle}>Choose Icon</Text>
          {showIconError && (
            <Text style={styles.validationText}>Icon is required</Text>
          )}
          
          <FlatList
            data={iconOptions}
            renderItem={renderIcon}
            keyExtractor={(item) => item}
            numColumns={5}
            contentContainerStyle={styles.iconGrid}
            style={{ flexGrow: 0 }}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1, 
    justifyContent: 'space-between', 
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
    marginTop: 15,
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Lexend-Regular',
  },
  validationText: {
    color: 'red',
    fontSize: 12,
    marginHorizontal: 6,
    fontFamily: 'Lexend-Regular',
  }
});
