import Firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-database';
import 'firebase/firestore';
// import 'firebase/messaging';

const firebaseConfig = {
    
};

export default Firebase.initializeApp(firebaseConfig);
Firebase.firestore().settings({ experimentalForceLongPolling: true });