import React from "react";
import { View, Image, StyleSheet,Pressable,Text,Alert } from "react-native";
import { useState,useEffect } from "react";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {app} from '../firebaseConfig'
import { useNavigation } from "@react-navigation/native";
import MyTextInput from "../components/MyTextInput";
import {getFirestore,addDoc,collection} from 'firebase/firestore'


export default function SignUpScreen() {
  //Initialization
  const auth = getAuth(app);
  const navigation = useNavigation();
  const db = getFirestore(app)
  //Inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullName] = useState("");
  const [phone,setPhone] = useState("");
  const [block,setBlock] = useState("");
  const [room,setRoom] = useState("");

  //Removing any rogue whitespaces from the email string to avoid errors
  const cleanEmail = (email) => {
    return email.replace(/\s/g, ''); // Removes all white spaces from email
  };
  
  //Function to navigate to Main page
  const gohome = async (email,password)=>{
    try{
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      //console.log('User signed in after signup: ',user);
       navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }], // Name of the screen to navigate after login
      });

    }catch(error){
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(Alert.alert(errorMessage));
    }
  }

  //Function to sign up
  const signup = async ()=>{
    try{
      const cleanedEmail = cleanEmail(email);
      const userCredential = await createUserWithEmailAndPassword(auth,cleanedEmail,password);
      const user = userCredential.user;
      console.log('User created: ',cleanedEmail);
      gohome(cleanedEmail,password);
      const docRef = await addDoc(collection(db,"users"),{
        userid:user.uid,
        name:fullname,
        email:cleanedEmail,
        phone:phone,
        block:block,
        room:room,
      });
    }catch(error){
      const errorCode = error.code;
      const errorMessage = error.message;
      if(errorCode==='auth/email-already-in-use'){
        Alert.alert('Error','Email already in use. Use different email, or login with existing.');
      }
      else if(errorCode==='auth/weak-password'){
        Alert.alert('Error','Password too weak. Try a new password.');
      }else{
      console.error('Error creating user: ',errorCode,errorMessage)
      Alert.alert(errorMessage)
      }
    }
  }

  
  
  return (
    <View style={styles.container}>
      <Image source={require(".//logo.png")} style={styles.image} />
      <MyTextInput
        value={fullname}
        onChange={setFullName}
        placeholder={"Fullname"}
      />
      <MyTextInput
        value={phone}
        onChange={setPhone}
        placeholder={"Phone Number"}
      />
      <MyTextInput
        value={block}
        onChange={setBlock}
        placeholder={"Block Name"}
      />
      <MyTextInput
        value={room}
        onChange={setRoom}
        placeholder={"Room Number"}
      />
      <MyTextInput
        value={email}
        onChange={setEmail}
        placeholder={"Email"}
      />
      <MyTextInput
        value={password}
        onChange={setPassword}
        placeholder={"Password"}
      />
      <View style={{ marginBottom: 20 }} />
      <Pressable
      style = {styles.button}
      onPress={signup}
    >
      <Text style = {styles.text}
      >
        SignUp
      </Text>
    </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    marginTop: -350,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingTop: 250,
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
});
