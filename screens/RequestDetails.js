import { StyleSheet,Text,TextInput,View ,Button,ScrollView,Image,Alert,Pressable} from "react-native";
import React, { useEffect, useState } from 'react';
import { app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs,addDoc, updateDoc,doc} from 'firebase/firestore';

export default function RequestDetails({ route }) {
    const { request } = route.params;
    const navigation = useNavigation();
    const auth = getAuth(app);
    const db = getFirestore(app);
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);

    //Check if the current user has already has an ongoing request.

    const AcceptRequest = async () => {
      
      const existingRequest = await getDocs(
        query(collection(db, "orders"), where("courierID", "==", currentUser))
      );
      if(existingRequest.size>0){
        Alert.alert("Error", "You have already accepted a request. Please complete it before accepting new requests.");
      }else{
      // Query to find the document ID
      const q = query(collection(db, 'orders'), where('customerID', '==', request.customerID));
      const querySnapshot = await getDocs(q);
    
      let documentId = null;
      querySnapshot.forEach((doc) => {
        documentId = doc.id;
      });
    
      if (documentId) {
        // Update the document with the new courier details
        const orderRef = doc(db, 'orders', documentId);
        await updateDoc(orderRef, {
          status: "accept",
          courierID: currentUser,
          courierDetails: userData,
        });
        console.log("Order updated successfully");
        navigation.navigate("Accept");
      } else {
        console.log("No matching document found");
        // Handle the case where no matching document is found
      }}
    };
    


    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          // User is signed in
          const userID = user.uid;
          setCurrentUser(userID); // Set the current user's UID in state
          //console.log('User ID:', userID);
          // Retrieve user data based on the current user ID
          getUserData(userID);
        } else {
          // No user is signed in
          setCurrentUser(null);
          console.log('No user signed in');
        }
      });
  
      // Unsubscribe to the listener when component unmounts
      return () => unsubscribe();
    }, []);
  
  
 
  // Function to retrieve user data based on current user ID
  const getUserData = async (userID) => {
    const q = query(collection(db, 'users'), where('userid', '==', userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      //console.log(doc.id, '=>', doc.data());
      setUserData(doc.data()); // Set user data in state
    });
  };

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
      <Pressable style={styles.button} onPress={AcceptRequest}>
        <Text style={styles.text}>Accept Request</Text>
      </Pressable>
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