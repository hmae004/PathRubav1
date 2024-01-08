import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebaseConfig';

// Import the screens
import RequestScreen from './screens/RequestScreen';
import AcceptScreen from './screens/AcceptScreen';
import ProfileScreen from './screens/ProfileScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import CreateRequest from './screens/CreateRequest';
import OptionsScreen from './screens/OptionsScreen';
import RequestDetails from './screens/RequestDetails';
import AcceptDetailsScreen from './screens/AcceptDetails';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth(app); // Initialize your authentication instance here

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) {
        setInitializing(false);
      }
    });

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  if (initializing) {
    return null; // Render a loading indicator until the authentication check is completed
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen name="Options" component={OptionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="LogIn" component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" options={{ headerShown: false }}>
              {() => (
                <Tab.Navigator
                  screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                      let iconName;

                      if (route.name === 'Request') {
                        return <AntDesign name="shoppingcart" size={size} color={color} />;
                      } else if (route.name === 'Accept') {
                        return <MaterialCommunityIcons name="cart-check" size={24} color="black" />
                      } else if (route.name === 'Profile') {
                        return <Feather name="user" size={24} color="black" />
                      }
                    },
                    tabBarActiveTintColor: 'blue',
                    tabBarInactiveTintColor: 'gray',
                  })}
                >
                  <Tab.Screen name="Request" component={RequestScreen} />
                  <Tab.Screen name="Accept" component={AcceptScreen} />
                  <Tab.Screen name="Profile" component={ProfileScreen} />
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name="Create Request" component={CreateRequest} />
            <Stack.Screen name="Request Details" component={RequestDetails} />
            <Stack.Screen name="Accept Details" component={AcceptDetailsScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
