import Paper from '@material-ui/core/Paper'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import React, { FC, Fragment } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      marginBottom: theme.spacing(2),
      display: "flex",
      flexDirection: "column",
      width: "100%",
      alignItems: "center",
    },
  })
)

export interface IPSettingItemPaper {
  title: string
  content: React.ReactNode
}

export const SettingItemPaper: FC<IPSettingItemPaper> = ({
  title,
  content,
}) => {
  const classes = useStyles()

  return (
    <Fragment>
      <Typography variant="h6">{title}</Typography>
      <Paper className={classes.paper} variant="outlined">
        {content}
      </Paper>
    </Fragment>
  )
}
