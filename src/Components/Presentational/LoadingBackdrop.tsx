import Backdrop from '@material-ui/core/Backdrop'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { FC, useState } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
)

export interface IPLoadingBackdrop {
  isLoading: boolean
  setTouchInput: (touchInput: boolean) => void
}

export const LoadingBackdrop: FC<IPLoadingBackdrop> = ({
  isLoading,
  setTouchInput,
}) => {
  const classes = useStyles()
  const [open, setOpen] = useState(true)
  return (
    <Backdrop className={classes.backdrop} open={open}>
      {isLoading ? (
        <CircularProgress color="inherit" />
      ) : (
        <Button
          variant="contained"
          color="secondary"
          onTouchStart={() => {
            setTouchInput(true)
          }}
          onClick={() => {
            setOpen(false)
          }}
        >
          START
        </Button>
      )}
    </Backdrop>
  )
}
