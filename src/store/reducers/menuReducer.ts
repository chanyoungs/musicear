import { MenuActionTypes } from '../actions/types'

export interface MenuState {
  profileDialogOpen: boolean
}

export const menuReducer = (
  state: MenuState = {
    profileDialogOpen: false,
  },
  action: MenuActionTypes
): MenuState => {
  switch (action.type) {
    case "SET_PROFILE_DIALOG_OPEN":
      return { ...state, profileDialogOpen: action.payload }
    default:
      return state
  }
}
