import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

import firebase from 'firebase/app'

const config = {
  apiKey: "AIzaSyCYMSFJ6TWcydvMztZjC6RFoWBKLibTDbA",
  authDomain: "musicear.firebaseapp.com",
  databaseURL: "https://musicear.firebaseio.com",
  projectId: "musicear",
  storageBucket: "musicear.appspot.com",
  messagingSenderId: "272304472740",
  appId: "1:272304472740:web:c9ad282e135981cfce1c31",
  measurementId: "G-8NQW0RMG71",
}

export const app = firebase.initializeApp(config)
export const auth = firebase.auth
export const firestore = firebase.firestore()
export const functions = firebase.functions()

export default firebase
