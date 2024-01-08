import React from "react";
import { ReactDOM } from "react";
import { StyleSheet,Text,TextInput,View ,Button,ScrollView,Image} from "react-native";
import {useState,useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


// Import the screens
import RequestScreen from './screens/RequestScreen'; // Update the path if necessary
import AcceptScreen from './screens/AcceptScreen'; // Update the path if necessary
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import TitleScreen from "./screens/Title";
import OptionsScreen from "./screens/OptionsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {

  return(
      <NavigationContainer>
        <Stack.Navigator>
          {/* Authentication Flow */}
          <Stack.Screen name="Options" component={OptionsScreen} options={{headerShown: false}}/>
          <Stack.Screen name="SignUp" component={SignUpScreen}/>
          <Stack.Screen name="LogIn" component={LoginScreen} />
          {/* Main App Flow */}
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator>
                <Tab.Screen name="Request" component={RequestScreen} />
                <Tab.Screen name="Accept" component={AcceptScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
}


const style = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"white",
    justifyContent:'center',
    alignItems:"center",
  },
  image:{
    paddingTop:60,
    width:300,
    height:300,
  }
});