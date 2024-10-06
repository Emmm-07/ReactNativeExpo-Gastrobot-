//To Start Development emulator: npx expo start --dev-client
//then switch to Expo Go: s

//To Start APK production build: eas build -p android --profile preview

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Button, TouchableOpacity, StyleSheet, Image, Text, Modal,Pressable, Vibration,Switch } from 'react-native';

import Slider from '@react-native-community/slider';
import { WebView } from 'react-native-webview';
import { useState,useEffect } from 'react';
import app from "./firebaseConfig"
import { getDatabase, ref, set,update, push, get, onValue, off } from 'firebase/database';
// import batt25 from './assets/icons/25.png'
// import batt50 from './assets/icons/50.png'
// import batt75 from './assets/icons/75.png'
// import batt100 from './assets/icons/100.png'


export default function App() {
  const [cameraPanHorizontal,setCameraPanHorizontal] = useState(90);
  const [cameraPanVertical,setCameraPanVertical] = useState(90);
  const [botMovement, setBotMovement] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isContainerEmpty, setisContainerEmpty] = useState(null);

  const [isVacuumOn,setIsVacuumOn] = useState(false);
  const [isSprayOn,setIsSprayOn] = useState(false);
  const [isFanOn,setIsFanOn] = useState(false);
  const [sprayOrFanImg,setSprayOrFanImg] = useState(require('./assets/icons/spray.png'));

  const db = getDatabase(app);
  const [batteryImg,setBatteryImg] = useState(require('./assets/icons/50.png'));

  const [modalImg,setModalImg] = useState(require('./assets/icons/warning.png'));
  const [isSwitchEnabled, setisSwitchEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent,setModalContent] = useState("");
  const [isRedModal,setIsRedModal] = useState(true);

  const [onMove,setIsOnMove] = useState(0);

  const toggleSwitch = () => {
    setisSwitchEnabled(previousState => !previousState);
    if(isSwitchEnabled){
      setSprayOrFanImg(require('./assets/icons/spray.png'));
    }else{
      setSprayOrFanImg(require('./assets/icons/fan.png'));
    }
  };

  useEffect(()=>{
    // const movementRef = ref(db,"gastrobot_alpha_build/botMovement"); 
    const batteryRef = ref(db,"gastrobot_alpha_build/batteryLevel");
    const containerRef = ref(db,"gastrobot_alpha_build/isContainerEmpty");
    const gasRef = ref(db,"gastrobot_alpha_build/gasLevel");

    const handleBatteryLevelChange = (snapshot) => {
      const level = snapshot.val();
      setBatteryLevel(level);

      // Update the image based on battery level
      if (level > 75) {
        setBatteryImg(require('./assets/icons/100.png'));
      } else if (level > 50) {
        setBatteryImg(require('./assets/icons/75.png'));
      } else if (level > 25) {
        setBatteryImg(require('./assets/icons/50.png'));
      } else {
        setBatteryImg(require('./assets/icons/25.png'));
        setModalContent("Low Battery");
        setModalImg(require('./assets/icons/warning.png'));
        setIsRedModal(true);
        Vibration.vibrate(100);
        setModalVisible(true);
      }
    };

    // onValue(movementRef,(snapshot)=>{
    //   setBotMovement(snapshot.val());
    // })

    onValue(batteryRef, handleBatteryLevelChange);

    onValue(containerRef,(snapshot)=>{
      setisContainerEmpty(snapshot.val());
      const isEmpty = snapshot.val()
      if(isEmpty){
        setModalContent("Container Empty");
        setModalImg(require('./assets/icons/warning.png'));
        setIsRedModal(true);
        Vibration.vibrate(100);
        setModalVisible(true);
      }
    });

    onValue(gasRef,(snapshot)=>{
      setisContainerEmpty(snapshot.val());
      const gasLevel = snapshot.val()
      if(gasLevel < 6){
        setModalContent("No Gas Left, You Can Enter");
        setIsRedModal(false);
        setModalImg(require('./assets/icons/check.png'));
        Vibration.vibrate(100);
        setModalVisible(true);
      }
    });
  
    return () => {
      // off(movementRef);
      off(batteryRef);
      off(containerRef);
      off(gasRef);
    }

  },[db]);


  //POSTS
  const postVacuum = async() =>{ 
    const newDocRef = ref(db,"gastrobot_alpha_build");            // push(ref(db,"test")); - generates a unique key each post request

    update(newDocRef,{
      isVacuumOn:isVacuumOn,
    }).then(()=>{
      console.log("post request vacuum");
    }).catch((error)=>{
      console.log(error);
    });
  }

  const postSpray = async(newSprayState) =>{ 
    const newDocRef = ref(db,"gastrobot_alpha_build");            // push(ref(db,"test")); - generates a unique key each post request
    update(newDocRef,{
      isSprayOn:newSprayState,
    }).then(()=>{
      console.log("post request spray");
    }).catch((error)=>{
      console.log(error);
    });
  }

  const postFan = async(newFanState) =>{ 
    const newDocRef = ref(db,"gastrobot_alpha_build");            
    update(newDocRef,{
      isFanOn:newFanState,
    }).then(()=>{
      console.log("post request Fan");
    }).catch((error)=>{
      console.log(error);
    });
  }

  const postHorizontal = async() =>{ 
    const newDocRef = ref(db,"gastrobot_alpha_build");            // push(ref(db,"test")); - generates a unique key each post request
    update(newDocRef,{
      cameraPanHorizontal:cameraPanHorizontal,
    }).then(()=>{
      console.log("post request cam horizontal");
    }).catch((error)=>{
      console.log(error);
    });
  }

  const postVertical = async() =>{ 
    const newDocRef = ref(db,"gastrobot_alpha_build");            // push(ref(db,"test")); - generates a unique key each post request
    update(newDocRef,{
      cameraPanVertical:cameraPanVertical,
    }).then(()=>{
      console.log("post request cam vertical");
    }).catch((error)=>{
      console.log(error);
    });
  }
  const postBotMovement = async(movementValue) =>{ 
    const newDocRef = ref(db,"gastrobot_alpha_build");            // push(ref(db,"test")); - generates a unique key each post request
    update(newDocRef,{
      botMovement:movementValue,
    }).then(()=>{
      console.log("post request move");
    }).catch((error)=>{
      console.log(error);
    });
  }



  return (
    <View style={styles.container}>
    <StatusBar hidden={true} />
    <View style={styles.iframeContainer}> 
      <WebView 
        source={{ uri: 'https://img.freepik.com/free-photo/grunge-black-concrete-textured-background_53876-124541.jpg?t=st=1726626990~exp=1726630590~hmac=62feb9e684d793cf1fb62bc523b9412efe30a7bb4462bd18aaad175fbf87f56b&w=1060' }} 
        style={styles.webview}
        scrollEnabled={false}
      />
      
      <View style={styles.statusOverlay}>
          <TouchableOpacity style={styles.upButton} onPressIn={() => {
            console.log('Up');
            setBotMovement(1);
            postBotMovement(1);

          }}
          onPressOut={() => {
            setBotMovement(0);
            postBotMovement(0);
          }}
          >
              <Image source={require('./assets/icons/up.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.leftButton} onPressIn={() => {
                console.log('Left');
                setBotMovement(4);
                postBotMovement(4);
            }}
              onPressOut={() => {
                setBotMovement(0);
                postBotMovement(0);
            }}
            >
              <Image source={require('./assets/icons/left.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightButton} onPressIn={() => {
                console.log('Right');
                setBotMovement(2);
                postBotMovement(2);
            }}
              onPressOut={() => {
                setBotMovement(0);
                postBotMovement(0);
            }}
            >
              <Image source={require('./assets/icons/right.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.downButton} onPressIn={() => {
                console.log('Down');
                setBotMovement(3);
                postBotMovement(3);
            }}
              onPressOut={() => {
                setBotMovement(0);
                postBotMovement(0);
            }}
            >
              <Image source={require('./assets/icons/down.png')} style={styles.buttonImage} />
            </TouchableOpacity>
        <View style={styles.battery}>
          <Image source={batteryImg} style={styles.batteryIcon} />
        </View>
        {/* <Text style={styles.status}>Container: {isContainerEmpty}</Text> */}
        <Switch
          trackColor={{false: 'red', true: 'green' }}
          thumbColor={isSwitchEnabled ? '#f5dd4b' : '#f5dd4b'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}  
          value={isSwitchEnabled}
        />
      </View>
          
        

      <View style={styles.vacuumButtonContainer} >
        {/* <Button title="Vacuum" onPress={() => {}} style={styles.vacuumButton} /> */}
        <TouchableOpacity style={styles.vacuumButton} onPress={() =>{
          console.log("vacuuming");
            setIsVacuumOn(isVacuumOn?false:true);
            postVacuum();
        }}>
              <Image source={require('./assets/icons/vacuum.png')} style={styles.buttonImage_vacuum} />
          </TouchableOpacity>
      </View>

      <View style={styles. sprayButtonContainer}>
          <TouchableOpacity style={styles.sprayButton} onPress={() => {
            if(isSwitchEnabled){
              setIsSprayOn(false);
              setIsFanOn(!isFanOn);

              postSpray(false);
              postFan(!isFanOn)
            }else{
              setIsFanOn(false);
              setIsSprayOn(!isSprayOn);

              postFan(false)
              postSpray(!isSprayOn);
            }
            
              
          }}>
              {/* <Image source={require('./assets/icons/spray.png')} style={styles.buttonImage_spray} /> */}
              <Image source={sprayOrFanImg} style={styles.buttonImage_spray} />

          </TouchableOpacity>
      </View>

      <Slider 
        style={styles.sliderHorizontal} 
        minimumValue={0} 
        maximumValue={180}
        value={cameraPanHorizontal}
        onValueChange={(value)=>{
          setCameraPanHorizontal(value);
          postHorizontal();
        }}
        minimumTrackTintColor="#00ffe1" 
        maximumTrackTintColor="#00ffe1" 
        thumbTintColor="#278f83" 
        thumbStyle={styles.thumb} // Custom thumb styles
        trackStyle={styles.track} // Custom track styles 
      />

      <Slider 
        style={styles.sliderVertical} 
        minimumValue={0} 
        maximumValue={180} 
        value={cameraPanVertical}
        onValueChange={(value)=>{
          setCameraPanVertical(value);
          postVertical();
        }}
        minimumTrackTintColor="#00ffe1" 
        maximumTrackTintColor="#00ffe1" 
        thumbTintColor="#278f83" 
        thumbStyle={styles.thumb} // Custom thumb styles
        trackStyle={styles.track} // Custom track styles 
      />

        
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          // Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>

          <View style={[styles.modalView,{ backgroundColor: isRedModal ? '#e63232' : 'green' }]} onPress={()=>setModalVisible(!modalVisible)}>
          <Pressable
              onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.modalText}>
            <Image source={modalImg} style={styles.warningImage} />
               {modalContent} </Text>
         
              {/* <Text style={styles.textStyle}>OK</Text> */}
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => {
          setModalVisible(true);
          Vibration.vibrate(100);
          }}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable> */}
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iframeContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  statusOverlay: {
    position: 'absolute',
    top: 10,
    left: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 20,
  },
  battery: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  batteryIcon: {
    width: 70,
    height: 50,
    marginRight: 9,
  },
  status: {
    fontSize: 14,
    color: 'white',

  },

  buttonImage: {
    width: 60,
    height: 60,
  },
  warningImage:{
    width: 20,
    height: 20,
  },
  upButton: {
    position: 'absolute',
    top: 190,
    left: 80
  },
  downButton: {
    position: 'absolute',
    top: 290,
    left: 80,
  },
  leftButton: {
    position: 'absolute',
    left: 30,
    top: 240,
  },
  rightButton: {
    position: 'absolute',
    // right: 655,
    left:130,
    top: 240,
  },

  vacuumButtonContainer: {
    position: 'absolute',
    bottom: 120,
    right: 50,
  },
  vacuumButton: {
    width: 90,
    height: 90,
  
  },
  buttonImage_vacuum:{
    width: 100,
    height: 100,
  },

  sprayButtonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 100,

  },
  sprayButton: {
    width: 150,
    height: 150,
  
  },
  buttonImage_spray:{
    width: 150,
    height: 150,
  },
  
  sliderHorizontal: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 200,
    height: 80,
    backgroundColor: 'transparent',
  },


  sliderVertical: {
    position: 'absolute',
    top: 200,
    right: 10,
    transform: [{ translateY: -100 }, { rotate: '90deg' }],
    width: 145,
    height: 20,
    backgroundColor: 'transparent',
  },

  thumb: {
    width: 30,  // Width of the thumb
    height: 30, // Height of the thumb
    borderRadius: 15, // Makes the thumb round
    backgroundColor: '#1fb28a',
    borderColor:'red',
  },
  track: {
    height: 10, // Height of the track
    borderRadius: 5, // Rounds the track corners
  },


  //FOR MODAL ------------------
  modalView: {
    marginLeft: 250,
    borderRadius: 20,
    padding: 0,
    paddingTop:15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  //   width:50,
  // },
  // buttonClose: {
  //   backgroundColor: '#e3e3e3',
  //   width:80,
  //   height:40,
  // },
  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    // fontSize: ,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'white',
  },

});



