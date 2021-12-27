// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const config = {
  apiKey: "AIzaSyCY2FW0bubIfXaqOBMOemkMLKwMOUwHFhw",
authDomain: "crowndb-f02d5.firebaseapp.com",
  databaseURL: 'https://crwn-db.firebaseio.com',
  projectId: "crowndb-f02d5",
  storageBucket: "crowndb-f02d5.appspot.com",
  messagingSenderId: "210217648751",
  appId: "1:210217648751:web:1a421be72160378f78439a",
};

// apiKey: "AIzaSyCY2FW0bubIfXaqOBMOemkMLKwMOUwHFhw",
// authDomain: "crowndb-f02d5.firebaseapp.com",
// projectId: "crowndb-f02d5",
// storageBucket: "crowndb-f02d5.appspot.com",
// messagingSenderId: "210217648751",
// appId: "1:210217648751:web:1a421be72160378f78439a",
// measurementId: "G-RSN3WJ9MQ1"


firebase.initializeApp(config);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};
export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectsToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collections) => {
  const transformedCollection = collections.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title.toLowerCase()),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollection.reduce((accumulator, collection) => {
    accumulator[collection.title.toLowerCase()] = collection;
    return accumulator;
  }, {});
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;