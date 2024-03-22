import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, updateDoc, query, where, getDocs,collection} from 'firebase/firestore';
import { useNavigation } from "@react-navigation/native";
import { app } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';


export default function EditScreen() {
    const navigation = useNavigation();
    const auth = getAuth(app);
    const db = getFirestore(app);

    const [currentUser, setCurrentUser] = useState(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [items, setItems] = useState([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user.uid);
                fetchRequests(user.uid);
            } else {
                setCurrentUser(null);
            }
        });
        return unsubscribe;
    }, []);

    const fetchRequests = async (userID) => {
        const q = query(collection(db, 'orders'), where('customerID', '==', userID));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setSelectedValue(data.place);
                setItems(data.order);
            }
        });
    };

    //places dropdown
    const [showDropdown,setShowDropdown] = useState(false);
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


    const updateRequest = async () => {
        if (currentUser && items.length > 0) {
            const q = query(collection(db, 'orders'), where('customerID', '==', currentUser));
            const querySnapshot = await getDocs(q);
            let documentId = null;
            querySnapshot.forEach((doc) => {
                documentId = doc.id;
            });

            if (documentId) {
                // Update the document with the new courier details
                const orderRef = doc(db, 'orders', documentId);
                await updateDoc(orderRef, {
                    place: selectedValue,
                    order: items,
                });
                console.log("Order updated successfully");
                navigation.navigate("Main");
              } else {
                console.log("No matching document found");
                // Handle the case where no matching document is found
              }
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={() => removeItem(index)}>
                <Ionicons name="md-trash-outline" size={24} color="black" />
            </TouchableOpacity>
        </View>
    );

    const addItemToList = () => {
        if (inputValue.trim() !== '') {
            setItems([...items, inputValue]);
            setInputValue('');
        }
    };

    const removeItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };


    return (
        <View style={styles.container}>
            <Text>Choose a place for your order:</Text>
            <TouchableOpacity style={styles.selectedItem} onPress={toggleDropdown}>
                <Text>{selectedValue || "Select a place"}</Text>
            </TouchableOpacity>

            {showDropdown && (
                <View style={styles.dropdownContainer}>
                    {dropdownItems.map((item, index) => (
                        <TouchableOpacity key={index} style={styles.dropdownItems} onPress={() => selectPlace(item)}>
                            <Text>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter item"
                    value={inputValue}
                    onChangeText={setInputValue}
                />
                <Button title="Add Item" onPress={addItemToList} />
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />

            <Button title="Update Request" onPress={updateRequest} />
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
        paddingTop: 20,
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
});

