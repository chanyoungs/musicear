import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { FC } from 'react'

import Logo from './logo192.png'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    musicearContainer: {
      margin: "auto",
      display: "flex",
    },
    logo: {
      height: theme.spacing(4),
      marginRight: theme.spacing(2),
    },
  })
)

export interface IPCustomAppBar {
  onClickSettings: () => void
}

export const CustomAppBar: FC<IPCustomAppBar> = ({ onClickSettings }) => {
  const classes = useStyles()

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <div className={classes.musicearContainer}>
          <img src={Logo} className={classes.logo} />
          <Typography variant="h6" align="center">
            Music Ear
          </Typography>
        </div>
        <IconButton edge="end" color="inherit" onClick={onClickSettings}>
          <SettingsIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
