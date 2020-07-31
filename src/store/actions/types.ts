import { ExtendedFirestoreInstance, getFirebase } from 'react-redux-firebase'
import { ThunkAction } from 'redux-thunk'
import { IFBError } from 'src/Components/Pages/DictationPage/types'

import { AppState } from '../reducers/rootReducer'

// Setup
export type ThunkActionCustom<ReturnType> = ThunkAction<
  ReturnType,
  AppState,
  {
    getFirebase: typeof getFirebase
    // getFirebase: (() => typeof firebase) & typeof getFirebase
    getFirestore: () => ExtendedFirestoreInstance
  },
  AppActions
>

// Auth actions
export const SIGN_UP_ERROR = "SIGN_UP_ERROR"
export interface SignUpError {
  type: typeof SIGN_UP_ERROR
  payload: IFBError
}

export const MEMBER_PROFILE_CREATED_ERROR = "MEMBER_PROFILE_CREATED_ERROR"
export interface MemberProfileCreatedError {
  type: typeof MEMBER_PROFILE_CREATED_ERROR
  payload: IFBError
}

export const SIGN_IN_ERROR = "SIGN_IN_ERROR"
export interface SignInError {
  type: typeof SIGN_IN_ERROR
  payload: IFBError
}

export const REMEMBER_ME_ERROR = "REMEMBER_ME_ERROR"
export interface RememberMeError {
  type: typeof REMEMBER_ME_ERROR
  payload: IFBError
}

export const RESET_PASSWORD_ERROR = "RESET_PASSWORD_ERROR"
export interface ResetPasswordError {
  type: typeof RESET_PASSWORD_ERROR
  payload: IFBError
}

export const SIGN_OUT_ERROR = "SIGN_OUT_ERROR"
export interface SignOutError {
  type: typeof SIGN_OUT_ERROR
  payload: IFBError
}

export const EDIT_PROFILE_ERROR = "EDIT_PROFILE_ERROR"
export interface EditProfileError {
  type: typeof EDIT_PROFILE_ERROR
  payload: IFBError
}

export const UPLOAD_PHOTO_ERROR = "UPLOAD_PHOTO_ERROR"
export interface UploadPhotoError {
  type: typeof UPLOAD_PHOTO_ERROR
  payload: Error
}

export const DELETE_PHOTO_ERROR = "DELETE_PHOTO_ERROR"
export interface DeletePhotoError {
  type: typeof DELETE_PHOTO_ERROR
  payload: IFBError
}

export type AuthActionTypes =
  | SignUpError
  | MemberProfileCreatedError
  | SignInError
  | RememberMeError
  | ResetPasswordError
  | SignOutError
  | EditProfileError
  | UploadPhotoError
  | DeletePhotoError

// Menu Action types
export const SET_PROFILE_DIALOG_OPEN = "SET_PROFILE_DIALOG_OPEN"
export interface SetProfileDialogOpen {
  type: typeof SET_PROFILE_DIALOG_OPEN
  payload: boolean
}

export type MenuActionTypes = SetProfileDialogOpen

// All Action types
export type AppActions = AuthActionTypes | MenuActionTypes
