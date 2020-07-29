import { Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { FC } from 'react'
import * as React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      textTransform: "none",
      borderRadius: 0,
      whiteSpace: "pre-wrap",
      background: theme.palette.secondary.main,
    },
    signUpIn: {
      color: theme.palette.common.white,
    },
  })
)

export interface Props {
  onClick: () => void
  page: "signIn" | "signUp" | "resetPassword"
}

export const ChangeSignInUpButton: FC<Props> = ({ onClick, page }) => {
  const classes = useStyles()
  return (
    <Button
      variant="contained"
      // color="secondary"
      className={classes.button}
      onClick={onClick}
      fullWidth
    >
      <Typography color="primary" display="inline" variant="body2">
        {page !== "signUp"
          ? "Don't have an account? "
          : "Already have an account? "}
      </Typography>
      <Typography display="inline" variant="body2" className={classes.signUpIn}>
        {page !== "signUp" ? "Sign up" : "Sign in"}
      </Typography>
    </Button>
  )
}
