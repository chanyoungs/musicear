import { createMuiTheme } from '@material-ui/core'
import { CssBaseline } from '@material-ui/core'
import { MuiThemeProvider } from '@material-ui/core/styles'
import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import * as serviceWorker from './serviceWorker'
import { theme } from './theme'

ReactDOM.render(
  // <React.StrictMode>
  <MuiThemeProvider theme={createMuiTheme(theme)}>
    <CssBaseline />
    <App />
  </MuiThemeProvider>,
  // </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
