import React from "react";
import { View, Image, StyleSheet,Pressable,Text,Alert,KeyboardAvoidingView, TextInput} from "react-native";
import { useState,useEffect } from "react";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {app} from '../firebaseConfig'
import { useNavigation } from "@react-navigation/native";
import MyTextInput from "../components/MyTextInput";


export default function LoginScreen() {
    const auth = getAuth(app);
    const navigation = useNavigation();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");


    const gohome = async ()=>{
        try{
          const userCredential = await signInWithEmailAndPassword(auth,email,password);
          const user = userCredential.user;
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }], // Name of the screen to navigate after login
          });
    
        }catch(error){
          const errorCode = error.code;
          const errorMessage = error.message;
          if(errorCode==='auth/invalid-credential'){
            Alert.alert("Invalid credentials!");
            console.log(errorCode)
          }else{
          console.log(Alert.alert(errorMessage));
          }
        }
      }

    return(

        <View style= {styles.container}>
             <Image source = {require(".//logo.png")} style = {style.image}/>

             <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
             />
             <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    secureTextEntry
                />
            <View style={{marginBottom:20}}/>
            <Pressable
            style = {styles.button}
            onPress={gohome}
            >
            <Text style = {styles.text}
            >
                Login 
            </Text>
            </Pressable>
        </View>
    
    );
}

styles = StyleSheet.create({
    image:{
        width:200,
        height:200,
        marginTop:-350,
    },
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"white",
        paddingTop:250,
    },
    input:{
      height:40,
      width:'80%',
      borderWidth:2,
      borderColor:'gray',
      borderRadius:10,
      marginTop:15,
      padding:10,
    },
    username:{
        borderWidth:1,
        borderColor:"black",
        width:"80%",
        borderRadius:40,
    },
    textbox:{
        borderWidth: 1,
        borderColor: "black",
        width: "80%",
        borderRadius: 40,
        padding: 10,
        margin: 6,
  },
  text:{
        color: "white",
        textAlign: "center",
        fontFamily: "serif",
        fontWeight:"bold"
  },
  button:{
    backgroundColor: "#040720",
    padding: 10,
    borderRadius: 20,
    width: "80%",
  }
})