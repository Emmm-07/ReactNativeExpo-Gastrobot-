
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator} from "@react-navigation/native-stack"
import Controller from "./screens/Controller";
import { View } from "react-native";
import { enableScreens } from 'react-native-screens';
import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";

const Stack = createNativeStackNavigator();
enableScreens();
const App = () => {
  return (  
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen}  options={{
            headerShown: false,   // Removes the header
            contentStyle: { paddingTop: 0 }, // Ensures no extra padding or space is added
          }} />
          
          <Stack.Screen name="Controller" component={Controller}  options={{
            headerShown: false,   
            contentStyle: { paddingTop: 0 }, 
          }} />
         
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
export default App;