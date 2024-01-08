
          
import React, { useEffect } from "react";
import { View, Text, StyleSheet,Image} from "react-native";
import { useNavigation } from "@react-navigation/native";

const TitleScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Set a timeout to navigate to the LoginScreen after 2000 milliseconds (2 seconds)
    const timer = setTimeout(() => {
      navigation.replace("SignUp"); // Navigate to the Login screen
    }, 2000);

    // Clean up the timer to prevent memory leaks
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor:"white"}}>
      <Image source = {require(".//logo.png")} style = {style.image}/>
      {/* Add any title screen content here */}
    </View>
  );
};

export default TitleScreen;

style = StyleSheet.create({
  image:{
    width:200,
    height:200,
    justifyContent:"center",
    alignItems:"center",
  }
})