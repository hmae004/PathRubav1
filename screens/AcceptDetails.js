import {Pressable, StyleSheet,Text,TextInput,View ,Button,ScrollView,Image,Alert} from "react-native";
import React, { useEffect, useState } from 'react';
import { app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs,addDoc, updateDoc,doc} from 'firebase/firestore';

export default function AcceptDetailsScreen({ route }) {
    const { request } = route.params;
    const navigation = useNavigation();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);



    return (
      <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>REQUEST DETAILS</Text>
      <View style={styles.card}>
        <Text style={styles.detailText}>Block: {request.customerDetails.block}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.detailText}>Room: {request.customerDetails.room} </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.detailText}>Name: {request.customerDetails.name}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.detailText}>Phone: {request.customerDetails.phone}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.detailText}>Place: {request.place}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.detailText}>Order: {request.order.join(', ')}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.detailText}>Profit: {request.profit}</Text>
      </View>
    </ScrollView>
    );

  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#BDE0FE', // Lighter sky blue for the background
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 100,
      marginBottom:30,
      marginLeft: 110,
      color: "#007ACC", // Darker shade of sky blue for contrast
    },
    card: {
      backgroundColor: "#007ACC", // Sky blue cards
      borderRadius: 10,
      padding: 15,
      marginVertical: 5,
      marginHorizontal: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginTop:10,
    },
    detailText: {
      color: '#FFFFFF', // White text for contrast
      fontSize: 16,
    },
    text: {
      color: '#4B0082', // Indigo color for text
      textAlign: 'center',
      fontSize: 16,
      margin: 5,
    },
    button: {
      backgroundColor: '#FFB6C1', // Light pink for button
      padding: 15,
      borderRadius: 25,
      width: '80%',
      marginTop: 20,
      marginLeft:30,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
  
      },
  });
  
