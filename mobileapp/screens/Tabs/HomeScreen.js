import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import TopRightBlob from "../../components/svg/TopRightBlob";
import Header from "../../components/HomeScreen/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import HubInfoModal from "../../components/HomeScreen/HubInfoModal";
import Colors from "../../constants/Colors";
import Home from "../../components/HomeScreen/Home";
import { authenticateUser } from "../../api/services/onRunService";
import { updateLocalToken } from "../../store/slices/userSlice";
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../store/slices/userSlice'; 

export default function HomeScreen({ setCurrentHub, currentHub }) {
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const runStartupFetch = async () => {
      try {
        let email = user.email;
        let cloudToken = user.cloudToken;
  
        if (!email || !cloudToken) {
          console.log("No user info in Redux, checking AsyncStorage...");
  
          const storedEmail = await AsyncStorage.getItem('userEmail');
          const storedToken = await AsyncStorage.getItem('userToken');
  
          if (storedEmail && storedToken) {
            email = storedEmail;
            cloudToken = storedToken;
          }
        }
  
        if (email && cloudToken) {
          const authResponse = await authenticateUser(email, cloudToken); 
          console.log("Authenticated successfully.");
  
          dispatch(setUser({
            email: email,
            cloudToken: cloudToken,
            localToken: authResponse.localToken || null, 
          }));
          
        } else {
          console.log("No user info found anywhere. Skipping startup fetch.");
        }
      } catch (e) {
        console.error("Startup fetch failed:", e);
      }
    };
  
    runStartupFetch();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TopRightBlob />
      <Header setModalVisible={setModalVisible} setCurrentHub={setCurrentHub} currentHub={currentHub} />
      <HubInfoModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      <Home />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    alignItems: "center",
    justifyContent: "flex-start",
  },
});
