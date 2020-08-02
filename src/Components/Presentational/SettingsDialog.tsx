import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import React, { FC } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  })
)

export interface IPSettingsDialog {
  open: boolean
  handleClose: () => void
  onSave: () => void
  setTouchInput: (touchInput: boolean) => void
  children: React.ReactNode
}

export const SettingsDialog: FC<IPSettingsDialog> = ({
  open,
  handleClose,
  onSave,
  setTouchInput,
  children,
}) => {
  const classes = useStyles()

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle disableTypography className={classes.title}>
        <Typography variant="h5">Settings</Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            onSave()
            handleClose()
          }}
          onTouchStart={() => {
            setTouchInput(true)
          }}
          color="primary"
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  )
}
