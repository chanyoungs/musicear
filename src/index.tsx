import { createMuiTheme } from '@material-ui/core'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import firebase from 'firebase'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider, useSelector } from 'react-redux'
import { getFirebase, isLoaded, ReactReduxFirebaseProvider } from 'react-redux-firebase'
import { applyMiddleware, compose, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { createFirestoreInstance, getFirestore, reduxFirestore } from 'redux-firestore'
import thunk, { ThunkMiddleware } from 'redux-thunk'

import { App } from './App'
import * as serviceWorker from './serviceWorker'
import { AppState, rootReducer } from './store/reducers/rootReducer'
import { theme } from './theme'

const store = createStore(
  rootReducer,
  compose(
    composeWithDevTools(
      applyMiddleware(
        thunk.withExtraArgument({
          getFirestore,
          getFirebase,
        }) as ThunkMiddleware
      )
    ),
    reduxFirestore(firebase)
  )
)

const rrfConfig = {
  userProfile: "profiles",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
}

const AuthIsLoaded = ({ children }: { children: JSX.Element }) => {
  const auth = useSelector<AppState>((state) => state.firebase.auth)
  return isLoaded(auth) ? children : <div>splash screen...</div>
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <MuiThemeProvider theme={createMuiTheme(theme)}>
        <CssBaseline />
        <AuthIsLoaded>
          <App />
        </AuthIsLoaded>
      </MuiThemeProvider>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
