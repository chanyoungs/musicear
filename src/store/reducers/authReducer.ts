import { IFBError } from 'src/Components/Pages/DictationPage/types'

import { AuthActionTypes } from '../actions/types'

export interface AuthState {
  signInError?: IFBError
  signUpError?: IFBError
  resetPasswordError?: IFBError
  resetPasswordSuccess?: string
}

export const authReducer = (
  state: AuthState = {},
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case "SIGN_UP_ERROR":
      console.log("Sign up error!")
      console.error(action.payload)
      return { ...state, signUpError: action.payload }
    case "MEMBER_PROFILE_CREATED_ERROR":
      console.log("Member Profile Creating Error!")
      console.error(action.payload)
      return state
    case "SIGN_IN_ERROR":
      console.log("Sign in error!")
      console.error(action.payload)
      return { ...state, signInError: action.payload }
    case "REMEMBER_ME_ERROR":
      console.log("Persistence login error!")
      console.error(action.payload)
      return state
    case "RESET_PASSWORD_ERROR":
      console.log("Passsword reset link sending error!")
      console.error(action.payload)
      return { ...state, resetPasswordError: action.payload }
    case "SIGN_OUT_ERROR":
      console.log("Sign out error!")
      console.error(action.payload)
      return state
    case "EDIT_PROFILE_ERROR":
      console.log("Profile edit error!")
      console.error(action.payload)
      return state
    case "UPLOAD_PHOTO_ERROR":
      console.log("Photo upload error!")
      console.error(action.payload)
      return state
    default:
      return state
  }
}
