import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Controller from "./screens/Controller";
import { View, ActivityIndicator } from "react-native";
import { enableScreens } from 'react-native-screens';
import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';

const Stack = createNativeStackNavigator();
enableScreens();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // state for auth check
  const [isLoading, setIsLoading] = useState(true); // Loading state for async check

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const loginTime = await AsyncStorage.getItem('loginTime');
        console.log("Startup token: ", token);

        if (token && loginTime) {
          const isTokenValid = checkTokenValidity(loginTime);
          if (isTokenValid) {
            setIsAuthenticated(true); // token is valid
            setIsLoading(false); // finished checking
            return;
          }
        }

        setIsAuthenticated(false); // invalid token or no token
        setIsLoading(false); // finished checking
      } catch (error) {
        console.error("Error checking login status: ", error);
        setIsAuthenticated(false); // default to false in case of error
        setIsLoading(false); // finished checking
      }
    };

    checkLoginStatus();
  }, []);

  // Validate token (1-day expiration)
  const checkTokenValidity = (loginTime) => {
    const LOGIN_EXPIRY = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    const currentTime = new Date().getTime();
    return currentTime - parseInt(loginTime) < LOGIN_EXPIRY;
  };

  

  // Logout handler
  const handleLogout = async () => {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("loginTime");
    setIsAuthenticated(false);
  };

  // Show a loading spinner while determining auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          // Authenticated Stack
          <Stack.Screen
            name="Controller"
            options={{
              headerShown: false,
              contentStyle: { paddingTop: 0 },
            }}
          >
            {(props) => <Controller {...props} handleLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          // Unauthenticated Stack
          <Stack.Screen
            name="LoginScreen"
            options={{
              headerShown: false, // Removes the header
              contentStyle: { paddingTop: 0 }, // Ensures no extra padding or space is added
            }}
          >
            {(props) => <LoginScreen isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} {...props} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
