import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    bottomNavigation: {
      position: "sticky",
      bottom: 0,
      width: "100%",
    },
  })
)

export interface IPCustomBottomNavigation {
  bottomNavigationActions: {
    label: string
    icon: React.ReactNode
    onClick: (event: React.SyntheticEvent<any, Event>) => void
    disabled?: boolean
  }[]
}

export const CustomBottomNavigation: React.FC<IPCustomBottomNavigation> = ({
  bottomNavigationActions,
}) => {
  const classes = useStyles()
  return (
    <BottomNavigation showLabels className={classes.bottomNavigation}>
      {bottomNavigationActions &&
        bottomNavigationActions.map((action) => (
          <BottomNavigationAction
            key={action.label}
            label={action.label}
            icon={action.icon}
            onClick={action.onClick}
            disabled={action.disabled}
          />
        ))}
    </BottomNavigation>
  )
}
