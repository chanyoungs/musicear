import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import React, { FC, Fragment, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAccount } from 'src/store/actions/authActions'
import { setProfileDialogOpen } from 'src/store/actions/menuActions'
import { AppState } from 'src/store/reducers/rootReducer'

export const ProfileDialog: FC = () => {
  const dispatch = useDispatch()
  const open = useSelector<AppState, boolean>(
    (state) => state.menu.profileDialogOpen
  )
  const handleClose = () => {
    dispatch(setProfileDialogOpen(false))
  }

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false)
  }
  return (
    <Fragment>
      <Dialog
        open={confirmDialogOpen}
        onClose={handleConfirmDialogClose}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">WARNING</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you wish to delete account?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="primary" autoFocus>
            CANCEL
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteAccount())
            }}
            color="primary"
            autoFocus
          >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="profile-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">Profile</DialogTitle>
        <DialogContent>
          <Button
            onClick={() => {
              setConfirmDialogOpen(true)
            }}
          >
            DELETE ACCOUNT
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}
