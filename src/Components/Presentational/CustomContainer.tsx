import Container from '@material-ui/core/Container'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React, { PropsWithChildren } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: "100%",
    },
  })
)

export interface IPContainerMain<C> {
  children: C
}

function ContainerMain<C>({ children }: PropsWithChildren<IPContainerMain<C>>) {
  const classes = useStyles()
  return (
    <Container maxWidth="xs" className={classes.container}>
      {children}
    </Container>
  )
}

export { ContainerMain }
