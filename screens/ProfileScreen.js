import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);

 
  // Function to retrieve user data based on current user ID
  const getUserData = async (userID) => {
    const q = query(collection(db, 'users'), where('userid', '==', userID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      setUserData(doc.data()); // Set user data in state
    });
  };

  // Function to sign out
  const signout = () => {
    auth.signOut().then(() => {
      console.log('User signed out!');
      navigation.replace('Options');
    });
  };

  // Detect user and retrieve user id on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        const userID = user.uid;
        setCurrentUser(userID); // Set the current user's UID in state
        console.log('User ID:', userID);
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

  return (
    <View style={styles.container}>
        {userData && ( // Check if userData exists before rendering
        <View style={styles.detailsContainer}>
          <Text>Name: {userData.name}</Text>
          <Text>Phone: {userData.phone}</Text>
          <Text>Block Number: {userData.block}</Text>
          <Text>Room Number: {userData.room}</Text>
        </View>
      )}
      <Pressable style={styles.button} onPress={signout}>
        <Text style={styles.text}>Sign Out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer:{

  },
  text: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#040720',
    padding: 10,
    borderRadius: 20,
    width: '80%',
  },
});
