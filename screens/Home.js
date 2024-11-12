import { View,Text,Button,Image,StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";


const Home = () => {
    const navigation = useNavigation();
    return (  
        <View  style={styles.homeContainer}>
             {/* <Image source={require('../assets/icons/GastroBotIcon.png')}  />     */}
            <Text>
                Hello
            </Text>
            <Button title="Click here"
                onPress={()=>navigation.navigate("Controller")}
                style={styles.button}
            > 
            </Button>
           
        </View>
    );
}
 
const styles = StyleSheet.create({
    button:{
        position:'absolute',
        top:60,
        backgroundColor:'yellow',

    },
    homeContainer:{
        flex:1,
        backgroundColor:'red',
        justifyContent: 'center', 
        alignItems: 'center',
    }
});
export default Home;