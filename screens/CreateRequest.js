import React from "react";
import { View, Image, StyleSheet,Pressable,Text,Alert,TextInput,FlatList,Button,TouchableOpacity} from "react-native";
import { useState,useEffect } from "react";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {app} from '../firebaseConfig'
import { useNavigation } from "@react-navigation/native";
import MyTextInput from "../components/MyTextInput";
import {getFirestore,addDoc,collection,getDocs,query,where} from 'firebase/firestore'
import { Ionicons } from '@expo/vector-icons'; 


export default function CreateRequest() {
    const [inputValue, setInputValue] = useState('');
    const [items, setItems] = useState([]);

    const auth = getAuth(app);
    const navigation = useNavigation();
    const db = getFirestore(app)
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData]
     = useState(null);

    //Finding user id
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            // User is signed in
            const userID = user.uid;
            setCurrentUser(userID); // Set the current user's UID in state
           // console.log('User ID:', userID);
          } else {
            // No user is signed in
            setCurrentUser(null);
            console.log('No user signed in');
          }
        });
    
        // Unsubscribe to the listener when component unmounts
        return () => unsubscribe();
      }, []);

    //Designing dropdown
    const [showDropdown,setShowDropdown] = useState(false);
    const [selectedValue, setSelectedValue] = useState('Vishwaas');
    const dropdownItems = ['Vishwaas', 'Canteen', 'Snow Cube', "Rishab's"];
    const selectPlace = (place) => {
        setSelectedValue(place);
        setShowDropdown(false);
      };
    
    const renderPlaces = (place) => {
        return (
          <TouchableOpacity style={styles.dropdownItems} onPress={() => selectPlace(place)}>
            <Text>{place}</Text>
          </TouchableOpacity>
        );
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
      };

    
   //Designing shopping list
    const removeItem = (index) => {
      const updatedItems = [...items];
      updatedItems.splice(index, 1);
      setItems(updatedItems);
    };
   
    const renderItem = ({ item, index }) => {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item}</Text>
          <TouchableOpacity onPress={() => removeItem(index)}>
             <Ionicons name="md-trash-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    };
  
    const addItemToList = () => {
      if (inputValue.trim() !== '') {
        setItems([...items, inputValue]);
        setInputValue('');
      }
    };

    //Writing request to firestore
    const results = async () => {
        const existingRequest = await getDocs(
          query(collection(db, "requests"), where("userid", "==", currentUser))
        );
      
        if (existingRequest.size > 0) {
          // If a request already exists for the current user ID
          Alert.alert("Error", "You have already placed a request.");
        } else {
          // If no existing request is found, proceed to add the request
          const docRef = await addDoc(collection(db, "requests"), {
            userid: currentUser,
            place: selectedValue,
            order: items,
            status: "pending",
            profit:10,
          });
          const acceptRef = collection(db, 'accept');
            await addDoc(acceptRef, {
              userid: currentUser,
              place: selectedValue,
              order: items,
              status: "pending",
              profit:10,
            });
          navigation.navigate("Main");
          
        }
      };
  
    return (
      <View style={styles.container}>
        <Text>Click below and choose a place: </Text>
        <View style={{paddingBottom:20}}/>
        <TouchableOpacity style={styles.selectedItem} onPress={toggleDropdown}>
        <Text>{selectedValue}</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View style={styles.dropdownContainer}>
          {dropdownItems.map((item, index) => (
            <View key={index}>{renderPlaces(item)}</View>
          ))}
        </View>
      )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter item"
            value={inputValue}
            onChangeText={(text) => setInputValue(text)}
          />
          <Button title="Add" onPress={addItemToList} />
        </View>
  
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        <Button title="Place Request" onPress={results}/>
      </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      paddingTop: 40,
    },
    selectedItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
      },
      dropdownContainer: {
        marginTop: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      dropdownItems: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
      },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 20,
      paddingTop:20,
    },
    input: {
      flex: 1,
      marginRight: 10,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      borderRadius: 5,
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f0f0f0',
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
    },
    itemText: {
      flex: 1,
    },
    submit:{
        padding:50,
        paddingLeft:5,
      
    }
  });