import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyB6uyrGD9lbpQ2hU_z493NJFUUtDmraIPg",
  authDomain: "moyboy-2faed.firebaseapp.com",
  databaseURL: "https://moyboy-2faed.firebaseio.com",
  projectId: "moyboy-2faed",
  storageBucket: "moyboy-2faed.appspot.com",
  messagingSenderId: "720180007707"
};

firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
