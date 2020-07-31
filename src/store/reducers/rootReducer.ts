import { firebaseReducer } from 'react-redux-firebase'
import { combineReducers } from 'redux'
import { firestoreReducer } from 'redux-firestore'

import { authReducer } from './authReducer'
import { menuReducer } from './menuReducer'

export const rootReducer = combineReducers({
  auth: authReducer,
  menu: menuReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
})

export type AppState = ReturnType<typeof rootReducer>
