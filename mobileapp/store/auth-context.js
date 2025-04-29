import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../util/auth';
import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './slices/userSlice';

export const AuthContext = createContext();

function AuthContextProvider({ children }) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);

  const login = (email, password) => {
    setIsLoading(true);

    axios.post(`${BASE_URL}api/auth/authenticate`, {
      email,
      password,
    })
    .then(res => {
      const userInfo = res.data;

      setUserInfo(userInfo);
      setUserToken(userInfo.token);
      setAuthStatus(res.status);

      AsyncStorage.setItem('userToken', userInfo.token);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      AsyncStorage.setItem('userEmail', email);

      dispatch(setUser({
        cloudToken: userInfo.token,
        email: email,
      }));

      console.log('Logged in user token:', userInfo.token);
    })
    .catch(e => {
      const status = e.response?.status || 'error';
      setAuthStatus(status);
      console.log(`Login Error: ${status}`);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const logout = () => {
    setIsLoading(true);
    setUserToken(null);
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('userInfo');
    AsyncStorage.removeItem('userEmail');
    dispatch(clearUser());
    setIsLoading(false);
  };

  const register = (username, email, password) => {
    setIsLoading(true);

    axios.post(`${BASE_URL}api/auth/register`, {
      username,
      email,
      password,
    })
    .then(res => {
      console.log(res.data);
      let userInfo = res.data;

      // Same as login: store user info & token
      setUserInfo(userInfo);
      setUserToken(userInfo.token);

      AsyncStorage.setItem('userToken', userInfo.token);
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      AsyncStorage.setItem('userEmail', email);

      dispatch(setUser({
        cloudToken: userInfo.token,
        email: email,
      }));

      console.log("User Registered, Token: " + userInfo.token);
    })
    .catch(e => {
      console.log(`Register Error: ${e}`);
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);

      let storedUserInfo = await AsyncStorage.getItem('userInfo');
      let storedUserToken = await AsyncStorage.getItem('userToken');
      let storedEmail = await AsyncStorage.getItem('userEmail');

      storedUserInfo = JSON.parse(storedUserInfo);

      if (storedUserInfo && storedUserToken && storedEmail) {
        setUserToken(storedUserToken);
        setUserInfo(storedUserInfo);

        dispatch(setUser({
          cloudToken: storedUserToken,
          email: storedEmail,
        }));
      }

      setIsLoading(false);

      // FOR REFRESHING TOKEN (DIDN'T TEST IT YET):
      // try {
      //   setIsLoading(true);
      //   let storedUserInfo = await AsyncStorage.getItem('userInfo');
      //   let userToken = await AsyncStorage.getItem('userToken');
      //   let userInfo = JSON.parse(storedUserInfo);
      //   if (userInfo && userToken) {
      //     const tokenExpiration = userInfo.tokenExpiration;
      //     const currentTime = Math.floor(Date.now() / 1000);
      //     if (tokenExpiration - currentTime < 300) {
      //       await refreshToken();
      //     } else {
      //       setUserToken(userToken);
      //       setUserInfo(userInfo);
      //     }
      //   }
      //   setIsLoading(false);
      // } catch (e) {
      //   console.log(`isLogged in error ${e}`);
      //   logout();
      // };
      
    } catch (e) {
      console.log(`isLogged in error: ${e}`);
      logout();
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        isLoading,
        userToken,
        authStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
