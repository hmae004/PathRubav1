import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Pressable, Text } from "react-native";
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { getAuth } from 'firebase/auth';
import { useNavigation } from "@react-navigation/native";
import { app } from '../firebaseConfig';

export default function RequestScreen() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const auth = getAuth(app);
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  //get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user.uid); // Set the current user's UID in state
      } else {
        setCurrentUser(null);     // Set current user to null if no user is signed in
      }
    });
  
    return unsubscribe; // Unsubscribe on component unmount
  }, []);
  

  //get docs from docs where status is request
  const fetchRequests = async () => {
    const requestsSnapshot = await getDocs(collection(db, 'orders'));
    const filteredRequests = requestsSnapshot.docs
      .map(doc => doc.data())
      .filter(request => request.status === 'request'&&request.customerID != currentUser);
    setRequests(filteredRequests);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>REQUESTS</Text>
      <FlatList
        data={requests}
        renderItem={({ item }) => (
          <Pressable style={styles.requestCard}>
            <Text style={styles.cardTitle}>STATUS: {item.status==="accept"?" Accepted":" Request"}</Text>
              <Text style={styles.cardContent}>PLACE: {item.place}</Text>
              <Text style={styles.cardContent}>PROFIT: {item.profit}</Text>
            <Pressable 
              style={styles.viewMoreButton} 
              onPress={() => navigation.navigate('Request Details', {request:item})}
            >
              <Text>View More</Text>
            </Pressable>
          </Pressable>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <AntDesign 
        name="pluscircle" 
        size={50} 
        color="black" 
        onPress={() => navigation.navigate("Create Request")} 
        style={styles.plusButton} 
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0FFFF", // Light Cyan, resembling sky blue
    padding: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    marginBottom:10,
    marginLeft: 130,
    color: "#007ACC", // Darker shade of sky blue for contrast
  },
  requestCard: {
    backgroundColor: "#F0FFFF", // Very light sky blue for card background
    borderWidth: 1,
    borderColor: '#B0E0E6', // Powder blue border
    borderRadius: 15,
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewMoreButton: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#87CEEB', // Sky blue color for buttons
    padding: 8,
    borderRadius: 10,
    elevation: 2,
  },
  Card: {
    borderWidth: 1,
    borderColor: '#B0E0E6',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007ACC', // Dark sky blue color for titles
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 14,
    color: '#333333', // Dark gray for better readability
    marginBottom: 5,
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
