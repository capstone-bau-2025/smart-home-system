import { useEffect } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import OvalButton from "../UI/OvalButton";  
import AuthInput from "../UI/AuthInput";

export default function AuthForm({ login, authStatus }) {
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Enter a valid email.")
      .required("Email is required to login"),
    password: Yup.string()
      .required("Password is required to login"),
  });

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          login(values.email, values.password);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldError, values, errors, touched }) => {
      
          useEffect(() => {
            if (authStatus === 403) {
              setFieldError("password", "Incorrect email or password");
            }
          }, [authStatus]);

          return (
            <>
              {/* Email Input */}
              <AuthInput
                placeholder="Enter your email"
                icon="mail-outline"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                errorMessage={touched.email && errors.email}
                autoCapitalize="none"
              />

              {/* Password Input */}
              <AuthInput
                placeholder="Enter your password"
                icon="lock-closed-outline"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                errorMessage={touched.password && errors.password}
              />

              {/* Login Button */}
              <OvalButton text="Login" color="black" onPress={handleSubmit} />

              {/* Forgot Password */}
              <Pressable onPress={() => console.log("forgot pass")} style={({ pressed }) => [styles.forgotPass, pressed && styles.pressed]}>
                <Text style={styles.forgotPass}>Forgot Password?</Text>
              </Pressable>
            </>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },  
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPass: {
    textDecorationLine: "underline",
    marginTop: 7.5,
    textAlign: "center",
    fontFamily: "Lexend-Regular",
    fontSize: 16,
    color: "#000000",
  },
  pressed: {
    opacity: 0.7,
  },
});
