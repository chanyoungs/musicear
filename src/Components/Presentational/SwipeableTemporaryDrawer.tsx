import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import HearingIcon from '@material-ui/icons/Hearing'
import React, { FC, Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFirestoreConnect } from 'react-redux-firebase'
import { useHistory, useLocation } from 'react-router-dom'
import { signOut } from 'src/store/actions/authActions'
import { setProfileDialogOpen } from 'src/store/actions/menuActions'
import { AppState } from 'src/store/reducers/rootReducer'

import { Paths } from '../Pages/types'
import { ProfileDialog } from './ProfileDialog'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: 250,
      // width: "auto",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    list: {
      flex: 1,
    },
    listItemIcon: {
      color: theme.palette.common.white,
    },
  })
)

interface Props {
  drawerOpen: boolean
  toggleDrawer: (open: boolean) => (event: React.MouseEvent) => void
}

type Item = {
  name: string
  icon: JSX.Element
  page: Paths
  divider?: "above" | "below"
  disabled?: boolean
  onClick?: () => void
}

export const SwipeableTemporaryDrawer: FC<Props> = ({
  drawerOpen,
  toggleDrawer,
}) => {
  const classes = useStyles()
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()

  const uid = useSelector<AppState, string>((state) => state.firebase.auth.uid)

  useFirestoreConnect([
    {
      collection: "usernames",
      doc: uid || "",
    },
  ])

  const username = useSelector<AppState, string>((state) => {
    const firestoreData = state.firestore.data
    if (firestoreData && "usernames" in firestoreData) {
      const usernamesObj = state.firestore.data.usernames
      if (usernamesObj && uid in usernamesObj) {
        const usernameObj = usernamesObj[uid]
        if (usernameObj && "username" in usernameObj) {
          return usernamesObj[uid].username
        }
      }
    }
    return ""
  })

  const profile = useSelector<AppState, any>((state) => state.firebase.profile)

  const isAuthenticated = useSelector<AppState, boolean>(
    (state) => !state.firebase.auth.isEmpty
  )

  const items: Item[] = [
    {
      name: isAuthenticated ? username : "Sign In",
      icon: <Avatar src={profile.thumbnailUrl} />,
      page: isAuthenticated ? "/" : "/auth",
      onClick: () => {
        dispatch(setProfileDialogOpen(true))
      },
      divider: "below",
    },
    {
      name: "Melody Dictation",
      icon: <HearingIcon />,
      page: "/dictation",
      disabled: !isAuthenticated,
    },
  ]

  return (
    <SwipeableDrawer
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
    >
      <div
        className={classes.drawer}
        role="presentation"
        onClick={toggleDrawer(false)}
      >
        <List className={classes.list}>
          {items.map((item, i) => (
            <Fragment key={i}>
              {item.divider === "above" && <Divider />}
              <ListItem
                button
                onClick={
                  item.onClick ? item.onClick : () => history.push(item.page)
                }
                selected={item.page === location.pathname}
                disabled={item.disabled}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
              {item.divider === "below" && <Divider />}
            </Fragment>
          ))}
        </List>
        {isAuthenticated && (
          <List>
            <ListItem
              button
              onClick={() => {
                dispatch(signOut())
              }}
            >
              <ListItemIcon className={classes.listItemIcon}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={"Sign Out"} />
            </ListItem>
          </List>
        )}
      </div>
    </SwipeableDrawer>
  )
}
