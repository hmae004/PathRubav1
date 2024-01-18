import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';

export default function EditProfile() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [block, setBlock] = useState('');
  const [room, setRoom] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setName(userData.name);
        setPhone(userData.phone);
        setBlock(userData.block);
        setRoom(userData.room);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleUpdate = async () => {
    const userDoc = doc(db, 'users', auth.currentUser.uid);

    try {
      await updateDoc(userDoc, {
        name: name,
        phone: phone,
        block: block,
        room: room,
      });
      Alert.alert("Profile Updated", "Your profile has been successfully updated.");
    } catch (error) {
      console.error("Error updating document: ", error);
      Alert.alert("Update Failed", "There was a problem updating your profile.");
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Block Number"
        value={block}
        onChangeText={setBlock}
      />
      <TextInput
        style={styles.input}
        placeholder="Room Number"
        value={room}
        onChangeText={setRoom}
      />
      <Button title="Update Profile" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 20,
    padding: 10,
  },
});
