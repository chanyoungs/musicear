import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import { AuthPage } from './Components/Pages/AuthPage'
import { PianoPage } from './Components/Pages/DictationPage'
import { PrivateRoute } from './PrivateRoute'
import { AppState } from './store/reducers/rootReducer'

export const App: FC = () => {
  const isAuthenticated = useSelector<AppState, boolean>(
    (state) => !state.firebase.auth.isEmpty
  )

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={() => <Redirect to="/dictation" />} />
        <PrivateRoute
          path="/dictation"
          component={PianoPage}
          shouldRedirect={!isAuthenticated}
          redirectPath="/auth"
        />
        <PrivateRoute
          path="/auth"
          component={AuthPage}
          shouldRedirect={isAuthenticated}
          redirectPath="/"
        />
      </Switch>
    </BrowserRouter>
  )
}
