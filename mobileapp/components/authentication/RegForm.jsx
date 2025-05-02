import { View, StyleSheet } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import OvalButton from "../UI/OvalButton";
import AuthInput from "../UI/AuthInput";

export default function RegForm({ register }) {
  // Updated Validation schema
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .matches(/^[a-zA-Z0-9_]{8,20}$/, "Username must be 8-20 characters, can only contain letters, numbers, and _ ")
      .required("Username is required!"),
    email: Yup.string()
      .email("Enter a valid email (e.g., user@example.com).")
      .required("Email is required!"), // ✅ No domain checking now
    password: Yup.string()
      .matches(/^(?=.*[A-Z])[A-Za-z\d]{8,}$/, "Must be 8+ characters, at least 1 uppercase letter and has no special characters ")
      .required("Password is required!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], "Passwords do not match")
      .required("Confirm password is required"),
  });

  return (
    <View style={styles.formContainer}>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          register(values.username, values.email, values.password);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <>
            <AuthInput
              placeholder="Enter your username"
              icon="person-outline"
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              errorMessage={touched.username && errors.username}
            />

            <AuthInput
              placeholder="Enter your email"
              icon="mail-outline"
              keyboardType="email-address"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              errorMessage={touched.email && errors.email}
            />

            <AuthInput
              placeholder="Enter your password"
              icon="lock-closed-outline"
              secureTextEntry
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              errorMessage={touched.password && errors.password}
            />

            <AuthInput
              placeholder="Confirm your password"
              icon="lock-closed-outline"
              secureTextEntry
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              errorMessage={touched.confirmPassword && errors.confirmPassword}
            />

            <OvalButton text="Register" color="black" onPress={handleSubmit} />
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
