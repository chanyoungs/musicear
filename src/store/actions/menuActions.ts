import { MenuActionTypes } from './types'

export const setProfileDialogOpen = (open: boolean) =>
  ({
    type: "SET_PROFILE_DIALOG_OPEN",
    payload: open,
  } as MenuActionTypes)
