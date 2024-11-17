
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator} from "@react-navigation/native-stack"
import Controller from "./screens/Controller";
import { View,ActivityIndicator } from "react-native";
import { enableScreens } from 'react-native-screens';
import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword,signOut } from 'firebase/auth'


const Stack = createNativeStackNavigator();
enableScreens();

const App = () => {
  const [isAuthenticated,setIsAuthenticated] = useState(null);

  useEffect(()=>{
    const checkLoginStatus = async() =>{
        const token = AsyncStorage.getItem('authToken');
        const loginTime = AsyncStorage.getItem('loginTime');
        console.log("startup token: ");
        console.log(token);
        if (token && loginTime) {
          const isTokenValid = checkTokenValidity(loginTime);
          if (isTokenValid) {
            setIsAuthenticated(true);
            return;
          }
        }
  
        setIsAuthenticated(false);
    }

    checkLoginStatus();
  },[]);

   // Validate token (1-day expiration)
   const checkTokenValidity = (loginTime) => {
    const LOGIN_EXPIRY = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const currentTime = new Date().getTime();
    return currentTime - parseInt(loginTime) < LOGIN_EXPIRY;
  };

    // Login handler
    const handleLogin = async (auth, email, password) => {
      if (!email || !password) {
        alert("Please provide both email and password.");
        return;
      }
      console.log("email:" + email);
      console.log("password:" + password);
    
      try {
        // Perform the login
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredentials.user;
        const currentTime = new Date().getTime();
    
        console.log('Logged in with:', user.email);
    
        // Await the ID token correctly
        const token = await user.getIdToken();
        console.log("Login token: ", token);
    
        // Store token and other data in AsyncStorage
        await AsyncStorage.setItem("authToken", token);
        await AsyncStorage.setItem("loginTime", currentTime.toString());
    
        alert("ID token: " + token);
        setIsAuthenticated(true);
    
        // navigation.navigate("Controller");
      } catch (error) {
        console.error("Login error:", error.message);
        alert(error.message);
      }
    };

      // Logout handler
    const handleLogout = async () => {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("loginTime");
      setIsAuthenticated(false);
    };

    // Show a loading spinner while determining auth state
  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {alert("Loading")}
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (  
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated?(
          // Authenticated Stack
            <Stack.Screen name="Controller" options={{
              headerShown: false,   
              contentStyle: { paddingTop: 0 }, 
            }} >
            
              {(props)=><Controller {...props} handleLogout={handleLogout}/>}
              
            </Stack.Screen>
            ):(
               // Unauthenticated Stack
            <Stack.Screen name="LoginScreen"   options={{
              headerShown: false,   // Removes the header
              contentStyle: { paddingTop: 0 }, // Ensures no extra padding or space is added
            }} >
              
              {(props)=><LoginScreen {...props} handleLogin={handleLogin}/>}
              
            </Stack.Screen>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default App;