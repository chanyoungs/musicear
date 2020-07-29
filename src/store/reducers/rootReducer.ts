import { firebaseReducer } from 'react-redux-firebase'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'

import { authReducer } from './authReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
})

export type AppState = ReturnType<typeof rootReducer>
