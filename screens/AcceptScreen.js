import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Pressable, Text } from "react-native";
import { getFirestore, getDocs, collection } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { app } from '../firebaseConfig';

export default function AcceptScreen() {
  const auth = getAuth(app);
  const navigation = useNavigation();
  const db = getFirestore(app);
  const [currentUser, setCurrentUser] = useState(null);
  const [yourRequests, setYourRequests] = useState([]);
  const [ongoingDeliveries, setOngoingDeliveries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    const requestsSnapshot = await getDocs(collection(db, 'orders'));
    const allRequests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const userRequests = allRequests.filter(request => request.customerID === currentUser);
    setYourRequests(userRequests);

    const acceptedRequests = allRequests.filter(request => request.status === 'accept' && request.courierID === currentUser);
    setOngoingDeliveries(acceptedRequests);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user.uid);
        fetchRequests();
      } else {
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  return (
    <View style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <Text style={styles.sectionTitle}>Your Requests</Text>
      <FlatList
        data={yourRequests}
        renderItem={({ item }) => (
          <Pressable style={styles.requestCard} onPress={() => navigation.navigate('Accept Details', { request: item })}>
            <Text style={styles.cardTitle} >STATUS: {item.status==='accept'? 'Accepted' : 'Request'}</Text>
            <Text style={styles.cardContent} >PLACE: {item.place}</Text>
            <Text  style={styles.cardContent}>PROFIT: {item.profit}</Text>
            <Pressable 
              style={styles.viewMoreButton} 
              onPress={() => navigation.navigate('Accept Details', {request:item})}
            >
              <Text>View More</Text>
            </Pressable>
            <Pressable 
              style={styles.viewMoreButton} 
              onPress={() => navigation.navigate('Edit Details', {request:item})}
            >
              <Text>Edit</Text>
            </Pressable>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <Text style={styles.sectionTitle}>Ongoing Deliveries</Text>
      <FlatList
        data={ongoingDeliveries}
        renderItem={({ item }) => (
          <Pressable style={styles.requestCard} onPress={() => navigation.navigate('Accept Details', { request: item })}>
              <Text style={styles.cardTitle}>STATUS: {item.status==="accept"?" Accepted":" Request"}</Text>
              <Text style={styles.cardContent}>PLACE: {item.place}</Text>
              <Text style={styles.cardContent}>PROFIT: {item.profit}</Text>
              <Pressable 
                  style={styles.viewMoreButton} 
                  onPress={() => navigation.navigate('Accept Details', {request:item})}
              >
                  <Text style={styles.buttonText}>View More</Text>
              </Pressable>
          </Pressable>
        )}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    marginLeft: 10,
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
});
