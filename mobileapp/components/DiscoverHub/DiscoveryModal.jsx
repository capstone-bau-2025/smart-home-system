import { Pressable, StyleSheet, Text, View } from "react-native";
import { configureHub } from "../../api/services/hubService";
import FullScreenModal from "../UI/FullScreenModal";
import { useState } from "react";
import EditInput from "../UI/EditInput";
import { Ionicons } from "@expo/vector-icons";
import {
  setAdminInvitationCode,
  addUserHub,
  setCurrentHub
} from "../../store/slices/hubSlice";
import { setUserRole } from "../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { registerWithInvitation } from "../../api/services/invRegisterService";


//modal that opens when hub card is pressed
export default function DiscoveryModal({
  visible,
  onClose,
  title,
  selectedHub,
  isConfigured
}) {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const hubState = useSelector((state) => state.hub);
  const user = useSelector((state) => state.user);


  const handleConnectHub = async () => {
    if (!value.trim()) {
      console.log("Invitation code is required.");
      return;
    }
  
    try {
      const result = await registerWithInvitation({
        invitation: value,
        email: user.email,
        cloudToken: user.cloudToken,
        hubSerialNumber: selectedHub.serialNumber,
      });
  
      if (!result) {
        console.log("Invalid or missing result from backend");
        return;
      }
  
      Toast.show({
        topOffset: 60,
        swipeable: true,
        type: "success",
        text1: `Connected successfully`,
        text2: `You are now connected to ${selectedHub.name}`,
      });
  
      const joinedHub = {
        serialNumber: selectedHub.serialNumber,
        hubName: selectedHub.name, 
        hubDetails: {
          status: selectedHub.status,
          location: selectedHub.location,
          name: selectedHub.name,
        },
      };
  
      dispatch(addUserHub(joinedHub));
      dispatch(setCurrentHub(joinedHub));
  
      onClose();
  
    } catch (error) {
      console.log("Failed to join hub:", error);
    }
  };

  const handleConfigureHub = async () => {
    if (selectedHub && value.trim()) {
      try {
        const result = await configureHub(value);

        if (!result) {
          console.log("Error: No result from configureHub");
          return;
        }
        console.log("Hub configured successfully:", result);
        
        dispatch(setUserRole(result.role));
        dispatch(setAdminInvitationCode(result.code));
        
        const newHub = {
          serialNumber: selectedHub.serialNumber,
          hubName: value,
          hubDetails: {
            status: selectedHub.status,
            location: selectedHub.location,
            name: selectedHub.name,
            // discovered: selectedHub.discovered,
          },
        };
        
        dispatch(addUserHub(newHub));
        dispatch(setCurrentHub({
          serialNumber: newHub.serialNumber,
          hubName: newHub.hubName,
          hubDetails: newHub.hubDetails,
        }));
        
        
        await registerWithInvitation({
          invitation: result.code,
          email: user.email,
          cloudToken: user.cloudToken,
          hubSerialNumber: selectedHub.serialNumber,
        });
        
        Toast.show({
          topOffset: 60,
          swipeable: true,
          type: "success",
          text1: `${value} configured successfully`,
          text2: `You are now the admin of this hub`,
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
        });
        
        onClose();
        
      } catch (error) {
        console.log("Failed to configure hub:", error);
      }
    } else {
      console.log("Hub name is required");
    }
  };
  

  return (
    <FullScreenModal visible={visible} onClose={onClose} title={title}>
      {isConfigured ? (
        <>
          <View style={styles.container}>
            <Ionicons
              name="help-circle-outline"
              size={70}
              style={styles.icon}
            />
            <Text style={styles.infoText}>
              To connect to this hub you need to enter an invitation code
              provided by the admin of this hub
            </Text>

            <View style={styles.input}>
              <EditInput
                placeholder={"enter code"}
                title={"Invitation code"}
                setChange={setValue}
                value={value}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.pressed,
                ]}
                onPress={handleConnectHub}
              >
                <Text style={styles.text}>confirm</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <Ionicons
              name="information-circle-outline"
              size={70}
              style={styles.icon}
            />
            <Text style={styles.infoText}>
              This hub (SN:{selectedHub?.serialNumber}) haven't been configured
              yet, to configure it enter a name
            </Text>

            <View style={styles.input}>
              <EditInput
                placeholder={"enter name"}
                title={"Enter hub name"}
                setChange={setValue}
                value={value}
                confirmButton={true} 
                onConfirm={handleConfigureHub}
              />

            </View>
          </View>
        </>
      )}
    </FullScreenModal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "95%",
  },
  infoText: {
    fontSize: 20,
    fontFamily: "Lexend-Regular",
    color: "#000000",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    width: "90%",
    alignItems: "center",
  },
  icon: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#e19b19",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
    marginTop: 10,
  },
  pressed: {
    opacity: 0.75,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
