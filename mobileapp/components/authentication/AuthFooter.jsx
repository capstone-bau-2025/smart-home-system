import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
//renders a footer for the authentication screens
export default function AuthFooter({navigation}) {
  return (

        <View style={styles.footer}>
          <Pressable
            onPress={() => navigation.navigate("Register")}
            style={({ pressed }) => (pressed ? [styles.pressed] : " ")}
          >
            <Text style={styles.signup1}>
              Don't have an account?{" "}
              <Text style={styles.signupText}>Signup</Text>
            </Text>
          </Pressable>
        </View>
  
  )
}

const styles = StyleSheet.create({
  signupText: {
    textDecorationLine: "underline",
    fontFamily: "Lexend-Regular",
    color: Colors.primary100,
    fontSize: 17,
  },
  signup1: {
    fontSize: 17,
    fontFamily: "Lexend-Regular",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 1, height: 3 },
    textShadowRadius: 4,
  },
  footer: {
    position: "absolute",
    bottom: 30,
  },
  
})