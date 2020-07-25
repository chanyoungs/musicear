import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import React, { FC } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    children: { padding: theme.spacing(2) },
  })
)

export interface IPSettingsDialog {
  open: boolean
  setOpen: (open: boolean) => void
  setTouchInput: (touchInput: boolean) => void
  children: React.ReactNode
}

export const SettingsDialog: FC<IPSettingsDialog> = ({
  open,
  setOpen,
  setTouchInput,
  children,
}) => {
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Settings</DialogTitle>
      <div className={classes.children}>{children}</div>
      <DialogActions>
        <Button
          autoFocus
          onClick={handleClose}
          onTouchStart={() => {
            setTouchInput(true)
          }}
          color="primary"
        >
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  )
}
