import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import EditProfile from './EditProfile';

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

  const editProfile = () => {
    navigation.navigate('Edit Profile')
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
    {userData && (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>Name: {userData.name}</Text>
        <Text style={styles.detailText}>Phone: {userData.phone}</Text>
        <Text style={styles.detailText}>Block Number: {userData.block}</Text>
        <Text style={styles.detailText}>Room Number: {userData.room}</Text>
      </View>
      )}
      <Pressable style={styles.button} onPress={null}>
    <Text style={styles.text}>Edit Profile</Text>
    </Pressable>
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
    backgroundColor: '#F0F8FF', // Light sky blue background
  },
  detailsContainer: {
    backgroundColor: '#FFF0F5', // Lavender blush background for details
    padding: 20,
    borderRadius: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

