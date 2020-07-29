import React, { FC } from 'react'
import { Redirect, Route } from 'react-router-dom'

import { Paths } from './Components/Pages/types'

export const PrivateRoute: FC<{
  path: Paths
  component: FC
  exact?: boolean
  shouldRedirect: boolean
  redirectPath: Paths
}> = ({ shouldRedirect, redirectPath, ...rest }) =>
  shouldRedirect ? <Redirect to={redirectPath} /> : <Route {...rest} />
