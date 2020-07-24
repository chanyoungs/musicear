import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC } from 'react'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export interface IPSettingsDialog {
  open: boolean
  setOpen: (open: boolean) => void
}

export const SettingsDialog: FC<IPSettingsDialog> = ({ open, setOpen }) => {
  const classes = useStyles()

  return (
    <Dialog
      onClose={() => {
        setOpen(false)
      }}
      open={open}
    >
      <DialogTitle>Settings</DialogTitle>
      <List>
        <ListItem>
          <ListItemIcon></ListItemIcon>
          <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
          <ListItemSecondaryAction></ListItemSecondaryAction>
        </ListItem>
      </List>
    </Dialog>
  )
}
