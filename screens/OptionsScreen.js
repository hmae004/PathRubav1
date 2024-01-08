import React from "react";
import { View, Image, StyleSheet,Pressable,Text,Alert,KeyboardAvoidingView,Button } from "react-native";
import { useState,useEffect } from "react";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import {app} from '../firebaseConfig'
import { useNavigation } from "@react-navigation/native";



export default function OptionsScreen() {
    const auth = getAuth(app);
    const navigation = useNavigation();

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth,(user)=>{
            if(user){
                console.log('User is signed in:');
                navigation.replace('Main');
            }
            else{
                console.log('No user is signed in');
            }
        });
        return () => unsubscribe();
    },[]);

    const goSignUp = () => {
        navigation.navigate('SignUp')
    }

    const goLogIn = () => {
        navigation.navigate('LogIn')
    }

    return(
        <View style= {style.container}>
             <Image source = {require(".//logo.png")} style = {style.image}/>
            
             <View style={{paddingTop:60}}/>
             <Pressable
            style = {style.button}
            onPress={goLogIn}
            >
            <Text style = {style.text}
            >
                Log In
            </Text>
            </Pressable>
             <View style={{paddingTop:20}}/>
             <Pressable
            style = {style.button}
            onPress={goSignUp}
            >
            <Text style = {style.text}
            >
                Sign Up
            </Text>
            </Pressable>
        </View>
    );
}

style = StyleSheet.create({
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
    username:{
        borderWidth:1,
        borderColor:"black",
        width:"80%",
        borderRadius:40,
    },
    text:{
        color: "white",
        textAlign: "center",
        fontFamily: "serif",
        fontWeight:"bold"
    },
    welcometext:{
        color: "black",
        textAlign: "center",
        fontFamily: "serif",
        fontWeight:"bold",
        fontSize: 16,
        marginTop: 10,
    },
    button:{
        backgroundColor: "#040720",
        padding: 10,
        borderRadius: 20,
        width: "80%",
    }
})