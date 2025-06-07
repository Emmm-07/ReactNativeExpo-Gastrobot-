//To Start Development emulator: npx expo start --dev-client
//then switch to Expo Go: s

//To Start APK production build: eas build -p android --profile preview
// To deploy/tunnel the video stream  to internet:  ngrok http 192.168.43.10:81

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Button, TouchableOpacity, StyleSheet, Image, Text, Modal,Pressable, Vibration,Switch } from 'react-native';

import Slider from '@react-native-community/slider';
import { WebView } from 'react-native-webview';
import { useState,useEffect } from 'react';
// import app from "./firebaseConfig"
// import { getDatabase, ref, set,update, push, get, onValue, off } from 'firebase/database';
import Constants from 'expo-constants';
import axios from 'axios';



export default function Controller({handleLogout}) {
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const config = Constants.manifest?.extra || Constants.expoConfig?.extra;
  const thingId = "28ade428-abc5-47d9-9e9f-b27d536e584a";//"d93de402-8b61-46de-bfb1-4a945667cf11"; // Replace with your Thing ID
  //Property IDs
  const batteryId = "0b1b5f2b-1d60-419e-b398-2e88ec6a601d"; 
  const gasId = "50a0388c-993c-406d-a879-ae76adec7d89"; 
  const containerId = "140b7cdc-cfb5-4675-a508-1e07995cae10"; 
  const gasBattIsemptyObstacleId = "e04a3b13-23c7-4af2-9937-9466ab0c2ca7";
  const videoUrlId = '4ca39a03-0154-4a4f-bd90-3ec018f7e1a8'

  const camHorizontalId = "1f925c7d-d36b-4fc5-b3ff-fe8389432c66"; 
  const camVerticalId = "b3fbb0b6-b5e7-4b6a-8a51-6c89225cd6e6"; 
  const fanId = "71409cf7-8f4d-4dd9-b26c-fb99d230ec01"; 
  const sprayId = "aa667363-f977-4354-9df3-e5b162df6d02"; 
  const vacuumId = "a39cbd17-5284-4bd7-b9c2-98afe5c78f83"; 
  const botMoveId = "4243c4b3-bc27-4bab-a223-03778745946c"; 
  const obstacleId = "49ab0a00-9ca2-4ff8-9687-5398cd7afb26"; 

  

  const [cameraPanHorizontal,setCameraPanHorizontal] = useState(90);
  const [cameraPanVertical,setCameraPanVertical] = useState(90);
  const [botMovement, setBotMovement] = useState(null);
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [isContainerEmpty, setisContainerEmpty] = useState(false);
  const [haveObstacle, setHaveObstacle] = useState(false);
  const [isLedOn, setIsLedOn] = useState(false);


  const [isVacuumOn,setIsVacuumOn] = useState(false);
  const [isSprayOn,setIsSprayOn] = useState(false);
  const [isFanOn,setIsFanOn] = useState(false);
  const [sprayOrFanImg,setSprayOrFanImg] = useState(require('../assets/icons/spray.png'));

  // const db = getDatabase(\\\);
  const [batteryImg,setBatteryImg] = useState(require('../assets/icons/50.png'));

  const [modalImg,setModalImg] = useState(require('../assets/icons/warning.png'));
  const [gasIndicImg,setGasIndicImg] = useState(require('../assets/icons/safe.png'));
  const [isSwitchEnabled, setisSwitchEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent,setModalContent] = useState("");
  const [isRedModal,setIsRedModal] = useState(true);

  var didGasNotif = false;
  const [moveDownDisabled,setMoveDownDisabled] = useState(false);
  const [moveUpDisabled,setMoveUpDisabled] = useState(false);
  const [sprayerDisabled,setSprayerDisabled] = useState(false);

  const [videoUrl,setVideoUrl] = useState('https://cdn.pixabay.com/photo/2014/06/16/23/39/black-370118_960_720.png');
 // http://192.168.43.10:81/stream
  // http://172.20.34.55:81/stream
  // https://img.freepik.com/free-photo/grunge-black-concrete-textured-background_53876-124541.jpg?t=st=1726626990~exp=1726630590~hmac=62feb9e684d793cf1fb62bc523b9412efe30a7bb4462bd18aaad175fbf87f56b&w=1060



  const toggleSwitch = () => {
    setisSwitchEnabled(previousState => !previousState);
    console.log(String("isSwitchOn toggle: "+isSwitchEnabled));
    if (sprayerDisabled) {
      setSprayOrFanImg(require('../assets/icons/xspray.png'));
      return;
    } 
    if(isSwitchEnabled){
      setSprayOrFanImg(require('../assets/icons/spray.png'));
    }else{
      setSprayOrFanImg(require('../assets/icons/fan.png'));
    }
  };

  //Fetch token for arduino iot
  useEffect(() => {
    let refreshTimeout;
    
    async function fetchToken() {
        const clientId = config?.clientId;
        const clientSecret = config?.clientSecret;

        const options = {
            method: 'POST',
            url: 'https://api2.arduino.cc/iot/v1/clients/token',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
            data: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
                audience: 'https://api2.arduino.cc/iot',
                // scopes: ['iot:things:write', 'iot:things:read'] // Request the necessary scopes // Request the necessary scopes
            }),
        };

        try {
            const response = await axios(options);
            const accessToken = response.data.access_token;
            const expiresIn = response.data.expires_in;               // token life = 300 seconds (5 mins)
            setToken(accessToken);

            refreshTimeout = setTimeout(fetchToken, (expiresIn-60)*1000);       //refresh token in 4 mins      
            // console.log(response.data.access_token);
            console.log("new token created");

            // get Video URL

        } catch (error) {
            console.error('Error fetching token:', error);
        }
    }

    fetchToken();

    return ()=>{
      clearTimeout(refreshTimeout);
    }
}, []);


// ----------For Firebase setup-------------------
async function fetchData(propertyId) {

  const options = {
      method: 'GET',
      url: `https://api2.arduino.cc/iot/v2/things/${thingId}/properties/${propertyId}`,
      headers: {
          'Authorization': `Bearer ${token}`,
      }
  };

  try {
      const response = await axios(options);
      setData(response.data);
      console.log("DATA name: "+response.data.name);
      console.log("DATA last value: "+response.data.last_value);
      console.log("DATA permission: "+response.data.permission);
      return response.data.last_value;
  } catch (error) {
      console.error('Error fetching data:', error);
      return '{}';
  }
}


async function sendData(newValue,propertyId) {
  const options = {
      method: 'PUT',
      url: `https://api2.arduino.cc/iot/v2/things/${thingId}/properties/${propertyId}/publish`,
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
      },
      data: JSON.stringify({
          value: newValue,
      }),
  };

  try {
      const response = await axios(options);
      console.log('Data sent successfully:', response.data);
      // fetchData(propertyId); // Refresh data after sending

  } catch (error) {
    console.error('Error sending data:', error.response ? error.response.data : error.message);
  }
} 

useEffect(() => {
  if (token) {
    async function fetchVideoUrl(propertyId) {
      const options = {
        method: 'GET',
        url: `https://api2.arduino.cc/iot/v2/things/${thingId}/properties/${propertyId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios(options);
        setVideoUrl(response.data.last_value);
        console.log('Video Url', response.data.last_value);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Call fetchData once the token is set
    fetchVideoUrl(videoUrlId); // Assuming videoUrl is the propertyId
  }
}, [token]); // This effect runs when `token` state changes




useEffect(()=>{

},[])

useEffect(() => {
  // Data Retreival
  if (token) {
    const interval = setInterval(async () => {
      const jsonString = await fetchData(gasBattIsemptyObstacleId); // Replace with your API call function
      

      try {
        console.log(jsonString);
        const jsonData = JSON.parse(jsonString);
        const batt = jsonData.batt;
        const gas = jsonData.gas;
        const isEmpty  = false;
        // const isEmpty  = jsonData.container;
        const haveObstacle = jsonData.obstacle;
        const haveObstacleFront = jsonData.obstacleFront; 
        const isWifiConnected = jsonData.isWifiConnected; //Changed
        console.log('Battery Level:', batt);
        console.log('Gas Level:', gas);
        console.log('Is Container Empty:', isEmpty);
        console.log('haveObstacle:', haveObstacle);

        setBatteryLevel(batt);

      
      // batt=90
      // Update the image based on battery level  
      if (batt > 75) {                                                      //Uncomment this ++++++++++++++++++++++===
        setBatteryImg(require('../assets/icons/100.png'));
      } else if (batt > 50) {
        setBatteryImg(require('../assets/icons/75.png'));
      } else if (batt > 25) {
        setBatteryImg(require('../assets/icons/50.png'));
      } else {
        setBatteryImg(require('../assets/icons/25.png'));
        setModalContent("Low Battery");
        setModalImg(require('../assets/icons/warning.png'));
        setIsRedModal(true);
        Vibration.vibrate(100);
        setModalVisible(true);
      }


      // isSwitchEnabled = false;
      // gas=15
      // For Gas Level
      console.log(String("isSwitchOn: "+isSwitchEnabled));
      if(gas < 30){                    //Changed
          setGasIndicImg(require('../assets/icons/safe.png'));
          console.log("gas low");
          if(isSwitchEnabled && !didGasNotif){
            didGasNotif = true;
            setModalContent("No Gas Left, You Can Enter");                         //Uncomment this ++++++++++++++++++++++===
            setIsRedModal(false);
            setModalImg(require('../assets/icons/check.png'));
            Vibration.vibrate(100);
            setModalVisible(true);
          } 
      }else{
        setGasIndicImg(require('../assets/icons/not_safe.png'));
        console.log("gas high");
        didGasNotif = false;
      }

    
      
      // isEmpty =true;
      // For IsEmpty
      if(isEmpty){         
        setSprayerDisabled(true);  
        setSprayOrFanImg(require('../assets/icons/xspray.png'));                    //Changed                                       //Uncomment this ++++++++++++++++++++++===
        setModalContent("Container Empty");
        setModalImg(require('../assets/icons/warning.png'));
        setIsRedModal(true);
        Vibration.vibrate(100);
        setModalVisible(true);
      }else{
        setSprayerDisabled(false);   
                                           //Changed
          setSprayOrFanImg(isSwitchEnabled 
          ? require('../assets/icons/fan.png')
          : require('../assets/icons/spray.png')) ;
      
      }

      // haveObstacle=true;
      // For haveObstacles
      // if obstacle rear
      if(haveObstacle){
        setMoveDownDisabled(true);
        setModalContent("Obstacle in Rear");                         //Uncomment this ++++++++++++++++++++++===
        setModalImg(require('../assets/icons/warning.png'));
        setIsRedModal(true);
        Vibration.vibrate(100);
        setModalVisible(true);
        
      }else{
        setMoveDownDisabled(false);
      }
      // If obstacle in front
      if(haveObstacleFront){
        setMoveUpDisabled(true);
        setModalContent("Obstacle in Front");                         //Uncomment this ++++++++++++++++++++++===
        setModalImg(require('../assets/icons/warning.png'));
        setIsRedModal(true);
        Vibration.vibrate(100);
        setModalVisible(true); 
      }else{
        setMoveUpDisabled(false);
      }
      // setIsLedOn(isWifiConnected);

      
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }
}, [token,isSwitchEnabled]);
// =====================================================================================






//----------For Firebase setup-------------------
// ----------- This is for the Firebase connection which is not needed if using Arduino cloud-------
  // useEffect(()=>{
  //   // const movementRef = ref(db,"gastrobot_alpha_build/botMovement"); 
  //   const batteryRef = ref(db,"gastrobot_alpha_build/batteryLevel");
  //   const containerRef = ref(db,"gastrobot_alpha_build/isContainerEmpty");
  //   const gasRef = ref(db,"gastrobot_alpha_build/gasLevel");
  //   const obstacleRef = ref(db,"gastrobot_alpha_build/haveObstacle");

  //   const handleBatteryLevelChange = (snapshot) => {
  //     const level = snapshot.val();
  //     setBatteryLevel(level);

  //     // Update the image based on battery level
  //     if (level > 75) {
  //       setBatteryImg(require('./assets/icons/100.png'));
  //     } else if (level > 50) {
  //       setBatteryImg(require('./assets/icons/75.png'));
  //     } else if (level > 25) {
  //       setBatteryImg(require('./assets/icons/50.png'));
  //     } else {
  //       setBatteryImg(require('./assets/icons/25.png'));
  //       setModalContent("Low Battery");
  //       setModalImg(require('./assets/icons/warning.png'));
  //       setIsRedModal(true);
  //       Vibration.vibrate(100);
  //       setModalVisible(true);
  //     }
  //   };

  //   // onValue(movementRef,(snapshot)=>{
  //   //   setBotMovement(snapshot.val());
  //   // })

  //   onValue(batteryRef, handleBatteryLevelChange);

  //   onValue(containerRef,(snapshot)=>{
  //     setisContainerEmpty(snapshot.val());
  //     const isEmpty = snapshot.val()
  //     if(isEmpty){
  //       setModalContent("Container Empty");
  //       setModalImg(require('./assets/icons/warning.png'));
  //       setIsRedModal(true);
  //       Vibration.vibrate(100);
  //       setModalVisible(true);
  //     }
  //   });

    // onValue(obstacleRef,(snapshot)=>{
    //   setHaveObstacle(snapshot.val());
    //   const haveObs = snapshot.val()
    //   if(haveObs){
    //     setModalContent("Obstacle behind");
    //     setModalImg(require('./assets/icons/warning.png'));
    //     setIsRedModal(true);
    //     Vibration.vibrate(100);
    //     setModalVisible(true);
    //   }
    // });

  //   onValue(gasRef,(snapshot)=>{
  //     setisContainerEmpty(snapshot.val());
  //     const gasLevel = snapshot.val()
  //     if(gasLevel < 6){
  //       setModalContent("No Gas Left, You Can Enter");
  //       setIsRedModal(false);
  //       setModalImg(require('./assets/icons/check.png'));
  //       Vibration.vibrate(100);
  //       setModalVisible(true);
  //     }
  //   });
  
  //   return () => {
  //     // off(movementRef);
  //     off(batteryRef);
  //     off(containerRef);
  //     off(gasRef);
  //   }

  // },[db]);
// -----------------------------------------------------------------------------------------------

  //POSTS
  const postVacuum = async(newVacuumState) =>{ 
    sendData(newVacuumState,vacuumId);
    console.log(newVacuumState);
  }

  const postSpray = async(newSprayState) =>{ 
    sendData(newSprayState,sprayId);
    console.log(newSprayState);
  }

  const postFan = async(newFanState) =>{ 
    sendData(newFanState,fanId);
    console.log(newFanState);
  }

  const postHorizontal = async() =>{ 
    sendData(cameraPanHorizontal,camHorizontalId);
    console.log(cameraPanHorizontal);
  }

  const postVertical = async() =>{ 
    sendData(cameraPanVertical,camVerticalId);
    console.log(cameraPanVertical);
  }

  const postBotMovement = async(movementValue) =>{ 
    sendData(movementValue,botMoveId);
    console.log(movementValue);
  }



  return (
    <View style={styles.container}>
    <StatusBar hidden={true} />
    <View style={styles.iframeContainer}> 
      <WebView 
        source={{ uri: videoUrl }} 
       
        style={styles.webview}
        scrollEnabled={false}
      />
      
      <View style={styles.statusOverlay}>
          <TouchableOpacity style={styles.upButton}  onPressIn={() => {
            console.log('Up');
            setBotMovement(1);
            postBotMovement(1);

          }}
          onPressOut={() => {
            setBotMovement(0);
            postBotMovement(0);
            
          }}
          disabled={moveUpDisabled}
          >
              <Image source={moveUpDisabled?require('../assets/icons/xUp.png') : require('../assets/icons/up.png')} style={styles.buttonImage} />
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
              <Image source={require('../assets/icons/left.png')} style={styles.buttonImage} />
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
              <Image source={require('../assets/icons/right.png')} style={styles.buttonImage} />
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
              disabled={moveDownDisabled}
            >
              <Image source={moveDownDisabled?require('../assets/icons/xdown.png') : require('../assets/icons/down.png')} style={styles.buttonImage} />
            </TouchableOpacity>
        <View style={styles.battery}>
          <Image source={batteryImg} style={styles.batteryIcon} />
          {/* <View style={[styles.wifiIndicator,{ backgroundColor: isLedOn ? 'yellow' : 'darkgray' },]}/> */}
          <Image source={gasIndicImg} style={styles.gasIndicator} />
        </View>
        
        {/* <Text style={styles.status}>Container: {isContainerEmpty}</Text> */}
        <Switch
          trackColor={{false: 'red', true: 'green' }}
          thumbColor={isSwitchEnabled ? 'white' : 'white'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}  
          value={isSwitchEnabled}
        />

      </View>
          
        

      <View style={[styles.vacuumButtonContainer,{opacity:isVacuumOn? 0.3:1}]} >
        {/* <Button title="Vacuum" onPress={() => {}} style={styles.vacuumButton} /> */}
        <TouchableOpacity style={styles.vacuumButton} onPress={() =>{
          console.log("vacuuming");
            setIsVacuumOn(!isVacuumOn);
            postVacuum(!isVacuumOn);
        }}>
              <Image source={require('../assets/icons/vacuum.png')} style={styles.buttonImage_vacuum} />
          </TouchableOpacity>
      </View>

      <View style={[styles.sprayButtonContainer,{opacity:isSprayOn||isFanOn? 0.3:1}]}>
          <TouchableOpacity style={styles.sprayButton} onPress={() => {
            if(isSwitchEnabled){
              setIsSprayOn(false);
              setIsFanOn(!isFanOn);

              postSpray(false);
              postFan(!isFanOn)
              console.log("Fanning");
            }else{
              setIsFanOn(false);
              setIsSprayOn(!isSprayOn);

              postFan(false)
              postSpray(!isSprayOn);
              console.log("Spraying");
            }
          
          }}
          disabled={sprayerDisabled}
          >
              {/* <Image source={require('./assets/icons/spray.png')} style={styles.buttonImage_spray} /> */}
              <Image source={sprayOrFanImg} style={styles.buttonImage_spray} />

          </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={()=>{handleLogout();console.log("logout");}} style={styles.logoutButtonContainer}>
        <Image  source={require('../assets/icons/logoutIcon.png')} style={styles.logoutButton} />
      </TouchableOpacity>
        <Slider 
          style={styles.sliderHorizontal} 
          minimumValue={0} 
          maximumValue={180}
          step={50}
          value={cameraPanHorizontal}
          onValueChange={(value)=>{
            setCameraPanHorizontal(value);
            postHorizontal();
          }}
          minimumTrackTintColor="#00ffe1" 
          maximumTrackTintColor="#00ffe1" 
          thumbTintColor="white" 
          thumbStyle={styles.thumb} // Custom thumb styles
          trackStyle={styles.track} // Custom track styles 
        />
      
      <Slider 
        style={styles.sliderVertical} 
        minimumValue={0} 
        maximumValue={180} 
        step={50}
        value={cameraPanVertical}
        onValueChange={(value)=>{
          setCameraPanVertical(value);
          postVertical();
        }}
        minimumTrackTintColor="#00ffe1" 
        maximumTrackTintColor="#00ffe1" 
        thumbTintColor="white" 
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
    backgroundColor: 'transparent',
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
    transform: [{ translateX: -100 },  { rotate: '180deg' }],
    width: 200,
    height: 80,
    backgroundColor: 'transparent',
    // zIndex:-2,
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
    height: 50, // Height of the track
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

  textStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color:'white',
  },
  wifiIndicator:{
    position:'absolute',
    height:30,
    width:30,
    borderRadius:30,
    top:60,
    left:5,
  },
  gasIndicator:{
    position:'absolute',
    height:50,
    width:50,
    borderRadius:30,
    top:50,
    left:5,
  },
  logoutButtonContainer:{
    width:50,
    height:50,
  
    position:"absolute",
    top:10,
    right:10,
  },
  logoutButton:{
    position:'absolute',
    width:40,
    height:40,
    // top:10,
    // right:10,
    // zIndex:2,


  }

});



