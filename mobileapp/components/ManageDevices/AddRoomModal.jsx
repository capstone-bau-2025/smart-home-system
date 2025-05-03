import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import FullScreenModal from '../UI/FullScreenModal';
import EditInput from '../UI/EditInput';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { addRoom } from '../../api/services/areaService';
import DissmissKeyboard from '../../components/utils/DismissKeyboard'
import { iconOptions } from '../../util/helperFunctions';
import Toast from 'react-native-toast-message';
// A modal that allows the user to add a room to the hub, it takes in a name and an icon
export default function AddRoomModal({ visible, onClose, title,refetchAreas  }) {
  const [roomName, setRoomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [showRoomNameError, setShowRoomNameError] = useState(false);
  const [showIconError, setShowIconError] = useState(false);

  const renderIcon = ({ item }) => {
    const [iconNumber, iconName] = item;
  
    return (
      <TouchableOpacity
        style={[
          styles.iconBox,
          selectedIcon === iconNumber && styles.selectedIconBox,
        ]}
        onPress={() => {
          setSelectedIcon(iconNumber);
          setShowIconError(false);
        }}
      >
        <Ionicons 
          name={iconName}
          size={30}
          color={selectedIcon === iconNumber ? '#fff' : '#444'}
        />
      </TouchableOpacity>
    );
  };

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
      const result = await addRoom(roomName, selectedIcon, '123456789');
      console.log('Room added:', result);
      await refetchAreas(); 
      setRoomName('');
      setSelectedIcon(null);
      setShowRoomNameError(false);
      setShowIconError(false);
      onClose();
      Toast.show({
        topOffset: 60,
        swipeable: true,
      
        type: "success",
        text1Style: {
          fontFamily: "Lexend-Bold",
          fontSize: 16,
          color: "black",
        },
        text2Style: {
          fontFamily: "Lexend-Regular",
          fontSize: 14,
          color: "#a8a8a8",
        },
        text1: "Room added successfully",
        text2: `${roomName} has been added`,
      });
    } catch (error) {
      console.log('Error while adding room:', error.response?.data || error.message);
    }
  }
  
  return (
    <FullScreenModal onClose={onClose} visible={visible} title={title}>
    <DissmissKeyboard>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <EditInput
              title={'Room name (must be unique)'}
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
              data={Object.entries(iconOptions)}
              renderItem={renderIcon}
              keyExtractor={(item) => item}
              numColumns={5}
              contentContainerStyle={styles.iconGrid}
              style={{ flexGrow: 0 }}
            />
          </View>
      
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Add</Text>
          </TouchableOpacity>
        </View>
    </DissmissKeyboard>
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
    marginBottom: 15,
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
