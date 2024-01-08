import React, { useState, useEffect } from "react";
import { View, FlatList, RefreshControl, StyleSheet, Pressable, Text } from "react-native";
import { getFirestore, getDocs, collection, query, where, addDoc} from 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {app} from '../firebaseConfig';
import userID from "../userID";
import { getAuth } from "firebase/auth";


export default function AcceptScreen() {
  const navigation = useNavigation();
  const db = getFirestore(app);
  const auth = getAuth(app);

  const [accept, setAccept] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRequests = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('No user signed in');
      return;
    }

    const currentUserID = currentUser.uid;

    const acceptSnapshot = await getDocs(query(collection(db, 'accept'), where('userid', '==', currentUserID)));
    const acceptData = [];

    for (const doc of acceptSnapshot.docs) {
      const acceptDetails = doc.data();
      const { place, profit, userid, order, status } = acceptDetails;

      // Only include requests with status: pending or placed
      if (status === 'pending' || status === 'placed') {
        const userSnapshot = await getDocs(query(collection(db, 'users'), where('userid', '==', userid)));
        const userData = userSnapshot.docs[0].data();
        const { room, block, name, phone } = userData;

        const subrequest = { place, profit, room, block, userid, order, name, phone };
        acceptData.push(subrequest);
      }
    }

    setAccept(acceptData);
  };

  useEffect(() => {
    fetchRequests();
    console.log(accept)

  }, []); // Run once on component mount

  // ... rest of your code
}
