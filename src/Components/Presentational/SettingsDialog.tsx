import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import React, { FC } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    closeButton: {},
    children: { padding: theme.spacing(2) },
  })
)

export interface IPSettingsDialog {
  open: boolean
  setOpen: (open: boolean) => void
  children: React.ReactNode
}

export const SettingsDialog: FC<IPSettingsDialog> = ({
  open,
  setOpen,
  children,
}) => {
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle disableTypography className={classes.root}>
        <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h5">Settings</Typography>
          </Grid>
          <Grid item>
            <IconButton className={classes.closeButton} onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </DialogTitle>
      <div className={classes.children}>{children}</div>
    </Dialog>
  )
}
