import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator} from 'react-native'
import auth from "../firebaseConfig"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,signOut } from 'firebase/auth'
import Loader from './Loader'
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = ({setIsAuthenticated}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword,setConfirmPassword] = useState('');

  const [isLogin,setIsLogin] = useState(true);
  const [showPassword,setShowPassword] = useState(false);
  const [showPassword2,setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const navigation = useNavigation()




  const handleSignUp = () => {
    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
  }
  const regexPassCheck= /(?=.*\d)(?=.*[!@#$%^&*])/; //with numbers, and special characters

  if(!regexPassCheck.test(password)){
      alert("Passwords must contain at least one number and a special character!");
    return;
  }
  // Check if the passwords match
  if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
  }
  setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        setIsLoading(false);
        setIsLogin(!isLogin)
      })
      .catch(error => {alert(error.message); setIsLoading(false);})

  }

  // Login handler
  const handleLogin = async (auth, email, password) => {
    if (!email || !password) {
      alert("Please provide both email and password.");
      return;
    }
    console.log("email:" + email);
    console.log("password:" + password);
    setIsLoading(true);
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

      // alert("ID token: " + token);
      setIsAuthenticated(true); // User authenticated
      setIsLoading(false); 
    } catch (error) {
      console.error("Login error:", error.message);
      alert(error.message);
      setIsLoading(false);
    }
  };

  // const handleLogin = () => {
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then(userCredentials => {
  //       const user = userCredentials.user;
  //       console.log('Logged in with:', user.email);
  //       navigation.navigate("Controller");
  //     })
  //     .catch(error => alert(error.message))
  // }

  return (
    
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
    >
       <Image source={require('../assets/icons/GastroBotIcon.png')} style={styles.logoImage} />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry = {showPassword}
        />
        <TouchableOpacity
          onPress={()=>setShowPassword(!showPassword)}
          style={styles.showPassContainer}
        >
                <Image source={showPassword?require('../assets/icons/hide.png'):require('../assets/icons/show.png')} style={styles.showPassImage} />
         </TouchableOpacity>


        {!isLogin && <><TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          style={styles.input}
          secureTextEntry = {showPassword2}
        />
          <TouchableOpacity
          onPress={()=>setShowPassword2(!showPassword2)}
          style={styles.showPassContainer}
        >
                <Image source={showPassword2?require('../assets/icons/hide.png'):require('../assets/icons/show.png')} style={styles.showPassImage} />
         </TouchableOpacity>
         </>
        }
         <Text style={{fontSize:12,marginTop:10,marginRight:20,textAlign:"right"}} >{isLogin?"Don't have an account yet? ":"Already have an account? "}
              <Text style={styles.haveAccountText} onPress={()=>{setIsLogin(!isLogin);setPassword('');setEmail('')}}>{isLogin?"Register":"Login"}</Text>
         </Text>

      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={isLogin?()=>handleLogin(auth,email,password):handleSignUp}
          style={[styles.button, !isLogin&&styles.buttonOutline]}
        >
          <Text style={isLogin?styles.buttonText:styles.buttonOutlineText}>{isLogin?"Login     ":"Register     "}</Text>
          {isLoading && <ActivityIndicator size="small" color="#333" />}
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity> */}
      </View>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white"
  },
  inputContainer: {
    width: '60%'
  },
  input: {
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,

  },
  buttonContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#0782F9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782F9',
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonOutlineText: {
    color: '#0782F9',
    fontWeight: '700',
    fontSize: 16,
  },
  logoImage:{
      width:100,
      height:60,
      marginBottom:10,
  },
  showPassContainer:{
    position:'relative',
    // zIndex:3,
  },
  showPassImage:{
    zIndex:3,
    width:45,
    height:45,
    position:'absolute',
    right:20,
    bottom:0,

  },
  haveAccountText:{
    color:"blue",
    
  }
})