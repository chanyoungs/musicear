import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import SettingsIcon from '@material-ui/icons/Settings'
import React, { FC, Fragment, useState } from 'react'

import Logo from './logo192.png'
import { SwipeableTemporaryDrawer } from './SwipeableTemporaryDrawer'

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
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent) => {
    setDrawerOpen(open)
  }

  return (
    <Fragment>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.musicearContainer}>
            <img src={Logo} className={classes.logo} alt="" />
            <Typography variant="h6" align="center">
              Music Ear
            </Typography>
          </div>
          <IconButton edge="end" color="inherit" onClick={onClickSettings}>
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SwipeableTemporaryDrawer
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
      />
    </Fragment>
  )
}
