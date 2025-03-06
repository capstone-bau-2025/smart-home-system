import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../util/auth';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

function AuthContextProvider({ children }) {

  const [isLoading, setIsLoading] = useState(false)
  const [userToken, setUserToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)
  const [authStatus, setAuthStatus] = useState(null) 


  const login = (email,password) => {
    setIsLoading(true)
    axios.post(`${BASE_URL}api/auth/authenticate`, {
      email,
      password
    })
    .then(res => {
      console.log(res.data)
      let userInfo = res.data
      setUserInfo(userInfo)
      setUserToken(userInfo.token)
      setAuthStatus(res.status)
      console.log(authStatus)
      AsyncStorage.setItem('userToken', userInfo.token) //storing token 
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)) //storing token 
      console.log("User Token " + userInfo.token)

    })
    .catch(e =>{
      
      setAuthStatus(e.response?.status || 'error');
      
      useEffect(() => {
        console.log(`Login Error ${authStatus}`);
      }, [authStatus]); // Runs whenever authStatus changes
      

    }) 
    setIsLoading(false)

  }

  const logout = () => {
    setIsLoading(true)
    setUserToken(null)
    AsyncStorage.removeItem('userToken')
    AsyncStorage.removeItem('userInfo')
    setIsLoading(false)
  }

  const register = (username, email, password) => {
    setIsLoading(true);
  
    axios.post(`${BASE_URL}api/auth/register`, {
        username,
        email,
        password
      })
      .then(res => {
        console.log(res.data);
        let userInfo = res.data;
  
        // Same as login: store user info & token
        setUserInfo(userInfo);
        setUserToken(userInfo.token);
  
        AsyncStorage.setItem('userToken', userInfo.token); // Store token 
        AsyncStorage.setItem('userInfo', JSON.stringify(userInfo)); // Store user info
        console.log("User Registered, Token: " + userInfo.token);
      })
      .catch(e => {
        console.log(`Register Error: ${e}`);
      });
  
    setIsLoading(false);
  };
  

  const isLoggedIn =  async() => {
    try{
    setIsLoading(true)
    let userInfo = await AsyncStorage.getItem('userInfo')
    let userToken = await AsyncStorage.getItem('userToken')
    userInfo = JSON.parse(userInfo);

    if(userInfo){
      setUserToken(userToken)
      setUserInfo(userInfo)
    }

  
    setIsLoading(false)

  //FOR REFRESHING TOKEN (DIDNT TEST IT YET):
  //   try {
  //     setIsLoading(true);
  
  //     let storedUserInfo = await AsyncStorage.getItem('userInfo');
  //     let userToken = await AsyncStorage.getItem('userToken');
  //     let userInfo = JSON.parse(storedUserInfo);
  
  //     if (userInfo && userToken) {
  //       const tokenExpiration = userInfo.tokenExpiration; // Assume backend sends token expiration
  //       const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
  
  //       // Check if token is about to expire (e.g., within 5 minutes)
  //       if (tokenExpiration - currentTime < 300) {
  //         await refreshToken(); // Refresh the token before it expires
  //       } else {
  //         setUserToken(userToken);
  //         setUserInfo(userInfo);
  //       }
  //     }
  
  //     setIsLoading(false);
  //   } catch (e) {
  //     console.log(`isLogged in error ${e}`);
  //     logout();
  //   }
  // };

  }
  catch(e){
    console.log(`isLogged in error ${e}`)
  }
  }




useEffect(() => {
  isLoggedIn();
},[]);

  return <AuthContext.Provider value={{register, login, logout, isLoading, userToken,authStatus}}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;