import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Button, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { WebView } from 'react-native-webview';
import { useState,useEffect } from 'react';
import app from "./firebaseConfig"
import { getDatabase, ref, set, push, get, onValue, off } from 'firebase/database';
import batt25 from './assets/icons/25.png'
import batt50 from './assets/icons/50.png'
import batt75 from './assets/icons/75.png'
import batt100 from './assets/icons/100.png'


export default function App() {
  const [cameraPanHorizontal,setCameraPanHorizontal] = useState(90);
  const [cameraPanVertical,setCameraPanVertical] = useState(90);
  const [botMovement, setBotMovement] = useState("");
  const [batteryLevel, setBatteryLevel] = useState("");
  const [containerLevel, setContainerLevel] = useState("");
  const db = getDatabase(app);
  const [batteryImg,setBatteryImg] = useState(require('./assets/icons/50.png'));


  useEffect(()=>{
    const movementRef = ref(db,"gastrobot_alpha_build/botMovement"); 
    const batteryRef = ref(db,"gastrobot_alpha_build/batteryLevel");
    const containerRef = ref(db,"gastrobot_alpha_build/containerLevel");

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
      }
    };

    onValue(movementRef,(snapshot)=>{
      setBotMovement(snapshot.val());
    })

    onValue(batteryRef, handleBatteryLevelChange)

    onValue(containerRef,(snapshot)=>{
      setContainerLevel(snapshot.val());
    })
  
    return () => {
      off(movementRef);
      off(batteryRef);
      off(containerRef);
    }

  },[db]);

  return (
    <View style={styles.container}>
    <StatusBar hidden={true} />
    <View style={styles.iframeContainer}>
      <WebView 
        source={{ uri: 'https://www.google.com/' }} 
        style={styles.webview}
        scrollEnabled={false}
      />
      
      <View style={styles.statusOverlay}>
          <TouchableOpacity style={styles.upButton} onPress={() => console.log('Up')}>
              <Image source={require('./assets/icons/up.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.leftButton} onPress={() => console.log('Left')}>
              <Image source={require('./assets/icons/left.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightButton} onPress={() => console.log('Right')}>
              <Image source={require('./assets/icons/right.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.downButton} onPress={() => console.log('Down')}>
              <Image source={require('./assets/icons/down.png')} style={styles.buttonImage} />
            </TouchableOpacity>
        <View style={styles.battery}>
          <Image source={batteryImg} style={styles.batteryIcon} />
        </View>
        <Text style={styles.status}>Container: {containerLevel}</Text>
       
      </View>

      {/* <View style={styles.moveButtonContainer}>
            <TouchableOpacity style={styles.upButton} onPress={() => console.log('Up')}>
              <Image source={require('./assets/icons/up.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.leftButton} onPress={() => console.log('Left')}>
              <Image source={require('./assets/icons/left.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.rightButton} onPress={() => console.log('Right')}>
              <Image source={require('./assets/icons/right.png')} style={styles.buttonImage} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.downButton} onPress={() => console.log('Down')}>
              <Image source={require('./assets/icons/down.png')} style={styles.buttonImage} />
            </TouchableOpacity>
      </View> */}

      <View style={styles.vacuumButtonContainer} >
        {/* <Button title="Vacuum" onPress={() => {}} style={styles.vacuumButton} /> */}
        <TouchableOpacity style={styles.vacuumButton} onPress={() => console.log('Down')}>
              <Image source={require('./assets/icons/vacuum.png')} style={styles.buttonImage_vacuum} />
          </TouchableOpacity>
      </View>

      <View style={styles. sprayButtonContainer}>
          <TouchableOpacity style={styles.sprayButton} onPress={() => console.log('Down')}>
              <Image source={require('./assets/icons/spray.png')} style={styles.buttonImage_spray} />
          </TouchableOpacity>
      </View>

      <Slider 
        style={styles.sliderHorizontal} 
        minimumValue={0} 
        maximumValue={180}
        value={cameraPanHorizontal}
        onValueChange={setCameraPanHorizontal}
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
        onValueChange={setCameraPanVertical}
        minimumTrackTintColor="#00ffe1" 
        maximumTrackTintColor="#00ffe1" 
        thumbTintColor="#278f83" 
        thumbStyle={styles.thumb} // Custom thumb styles
        trackStyle={styles.track} // Custom track styles 
      />
    </View>
  </View>
  );
}

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


  // moveButtonContainer: {
  //   flexDirection: 'column',
  //   alignItems: 'left',
  //   justifyContent: 'left',
  //   height: 200, // Adjust height as needed
  //   marginLeft: 120,
  //   marginTop:200,
  //   // borderColor: 'blue', 
  //   // borderWidth: 2,
  //   width:70,
  // },
  buttonImage: {
    width: 60,
    height: 60,
  },
  upButton: {
    position: 'absolute',
    top: 220,
    left: 80
  },
  downButton: {
    position: 'absolute',
    top: 320,
    left: 80,
  },
  leftButton: {
    position: 'absolute',
    left: 30,
    top: 270,
  },
  rightButton: {
    position: 'absolute',
    // right: 655,
    left:130,
    top: 270,
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
  }

});
