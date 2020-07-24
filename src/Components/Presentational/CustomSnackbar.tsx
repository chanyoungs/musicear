import Snackbar from '@material-ui/core/Snackbar'
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
  onClose: () => void
  severity: "error" | "success"
  message: string
}

export const CustomSnackbar: FC<IPCustomSnackbar> = ({
  open,
  onClose,
  severity,
  message,
}) => {
  const classes = useStyles()

  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      className={classes.snackbar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  )
}
