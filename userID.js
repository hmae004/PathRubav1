import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import {app} from './firebaseConfig'
import { getFirestore } from 'firebase/firestore';
import { useState } from 'react';
const userID = ()=>{
    const auth = getAuth(app);
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);

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
    
      console.log(currentUser)
      return currentUser;
}

export default userID;