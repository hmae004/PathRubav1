import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Pressable, Text } from "react-native";
import { getFirestore, getDocs, collection, query, where } from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {app} from '../firebaseConfig';


export default function RequestScreen() {
  const navigation = useNavigation();
  const db = getFirestore(app);

  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  //Navigation to request details page
  const navigateToDetails = (request) => {
    navigation.navigate('Request Details', { request });
  };

  //Getting requests from database
  const fetchRequests = async () => {
    const requestsSnapshot = await getDocs(collection(db, 'requests'));
    const requestsData = [];

    for (const doc of requestsSnapshot.docs) {
      const requestData = doc.data();
      const { place, profit, userid, order, status } = requestData;

      // Only include requests with status: pending
      if (status === 'pending') {
        const userSnapshot = await getDocs(query(collection(db, 'users'), where('userid', '==', userid)));
        const userData = userSnapshot.docs[0].data();
        const { room, block, name, phone } = userData;

        const subrequest = { place, profit, room, block, userid, order, name, phone };
        requestsData.push(subrequest);
      } else {
        // Remove the non-pending request from Firestore
        //await doc.ref.delete();
      }
    }

    setRequests(requestsData);
  };

  const createRequest = () => {
    navigation.navigate("Create Request")
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchRequests().then(() => {
      setRefreshing(false);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchRequests();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text>{requests.name} </Text>
      <FlatList
        data={requests}
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            style={styles.requestCard}
          >
            {/* Display request information */}
            <Text>{item.block}</Text>
            <Text>{item.room}</Text>
            <Text>{item.place}</Text>
            <Text>{item.profit}</Text>
            {/* View More button */}
            <Pressable style={styles.viewMoreButton} onPress={() => navigateToDetails(item)} >
              <Text>View More</Text>
            </Pressable>
          </Pressable>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        keyExtractor={(item, index) => index.toString()}
      />

      <View style={styles.plusButton}>
        <AntDesign name="pluscircle" size={50} color="black" onPress={createRequest} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  requestCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  viewMoreButton: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 5,
    borderRadius: 5,
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});
