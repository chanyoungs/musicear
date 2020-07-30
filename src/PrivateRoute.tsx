import React, { FC } from 'react'
import { useSelector } from 'react-redux'
import { Redirect, Route, RouteProps, useLocation } from 'react-router'

import { Paths } from './Components/Pages/types'
import { AppState } from './store/reducers/rootReducer'

export interface IPPrivateRoute extends RouteProps {
  path: Paths
  redirectConditionMet?: boolean
  redirectPath?: string
  checkFrom?: boolean
}

export const PrivateRoute: FC<IPPrivateRoute> = ({
  redirectConditionMet,
  redirectPath,
  checkFrom,
  ...rest
}) => {
  const isAuthenticated = useSelector<AppState, boolean>(
    (state) => !state.firebase.auth.isEmpty
  )

  const location = useLocation<{ from: string }>()
  const requestedPath = location.pathname

  // If checkFrom is true, redirect to the previously requested path or go home
  if (checkFrom) redirectPath = location.state?.from || "/"

  // By default, redirect to "/auth" if unauthenticated
  if (redirectConditionMet === undefined)
    redirectConditionMet = !isAuthenticated
  if (redirectPath === undefined) redirectPath = "/auth"

  return redirectConditionMet ? (
    <Route
      {...rest}
      render={() => (
        <Redirect
          to={{
            pathname: redirectPath,
            state: { from: requestedPath },
          }}
        />
      )}
      component={undefined}
      children={undefined}
    />
  ) : (
    <Route {...rest} />
  )
}
