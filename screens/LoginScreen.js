import { useNavigation } from '@react-navigation/core'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import auth from "../firebaseConfig"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword,signOut } from 'firebase/auth'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [checkPassword,setCheckPassword] = useState('');

  const [isLogin,setIsLogin] = useState(true);
  const [showPassword,setShowPassword] = useState(false);
  const [showPassword2,setShowPassword2] = useState(false);
  const navigation = useNavigation()

  useEffect(() => {
    // const unsubscribe = auth.onAuthStateChanged(user => {
    //   if (user) {
        // navigation.replace("Home")
    //   }
    // })

    // return unsubscribe
  }, [])

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
  if (password !== checkPassword) {
      alert("Passwords do not match!");
      return;
  }
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
      })
      .catch(error => alert(error.message))

  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
        navigation.navigate("Controller");
      })
      .catch(error => alert(error.message))
  }

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
          placeholder="Check Password"
          value={checkPassword}
          onChangeText={text => setCheckPassword(text)}
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
              <Text style={styles.haveAccountText} onPress={()=>setIsLogin(!isLogin)}>{isLogin?"Register":"Login"}</Text>
         </Text>

      </View>

      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={isLogin?handleLogin:handleSignUp}
          style={[styles.button, !isLogin&&styles.buttonOutline]}
        >
        <Text style={isLogin?styles.buttonText:styles.buttonOutlineText}>{isLogin?"Login":"Register"}</Text>
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
    width: '80%'
  },
  input: {
    backgroundColor: '#f6f6f6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
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
    width:50,
    height:50,
    position:'absolute',
    right:20,
    bottom:0,

  },
  haveAccountText:{
    color:"blue",
    
  }
})