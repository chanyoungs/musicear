import Snackbar, { SnackbarCloseReason } from '@material-ui/core/Snackbar'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import MuiAlert from '@material-ui/lab/Alert'
import React, { FC } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    snackbar: {
      top: theme.spacing(8),
    },
  })
)

export interface IPCustomSnackbar {
  open: boolean
  onCloseSnackbar: (
    event: React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason
  ) => void
  onCloseAlert: (event: React.SyntheticEvent<Element, Event>) => void
  severity: "error" | "success"
  message: string
  callback?: () => void
  autoHideDuration: number
}

export const CustomSnackbar: FC<IPCustomSnackbar> = ({
  open,
  onCloseSnackbar,
  onCloseAlert,
  severity,
  message,
  autoHideDuration,
}) => {
  const classes = useStyles()
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onCloseSnackbar}
      className={classes.snackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onCloseAlert}
        severity={severity}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  )
}
