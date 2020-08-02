import { IResetPassword, ISignIn, ISignUp } from 'src/Components/Pages/AuthPage/types'
import { setProfileDialogOpen } from 'src/store/actions/menuActions'

import { auth } from '../../firebase'
import { ThunkActionCustom } from './types'

// Sign Up Member
export const signUp = ({
  email,
  password,
  username,
  setSubmitting,
  openAlert: openAlertSignUp,
}: ISignUp): ThunkActionCustom<void> => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  setSubmitting(true)

  const firebase = getFirebase()

  try {
    await firebase.createUser({ email, password }, { email, username })
    openAlertSignUp()
  } catch (error) {
    dispatch({ type: "SIGN_UP_ERROR", payload: error })
    console.log(error)
  }

  setSubmitting(false)
}

// Sign In Member
export const signIn = ({
  email,
  password,
  rememberMe,
  setSubmitting,
}: ISignIn): ThunkActionCustom<void> => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  setSubmitting(true)
  console.log("Remember me: ", rememberMe)

  const firebase = getFirebase()

  try {
    // There are some type definition missing on ExtendedFirebaseInstance and so used original auth function from firebase
    await firebase
      .auth()
      .setPersistence(
        rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION
      )
    try {
      await firebase.login({ email, password })
      console.log("Sign in succesful!")
    } catch (error) {
      dispatch({ type: "SIGN_IN_ERROR", payload: error })
      console.log(error)
      console.log("autherror", getState().firebase.authError)
    }
  } catch (error) {
    dispatch({ type: "REMEMBER_ME_ERROR", payload: error })
    console.log(error)
  }

  setSubmitting(false)
}

// Send reset password link
export const resetPassword = ({
  email,
  setSubmitting,
  openAlert: openAlertResetPassword,
}: IResetPassword): ThunkActionCustom<void> => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  setSubmitting(true)

  const firebase = getFirebase()

  try {
    await firebase.resetPassword(email)
    console.log("Password reset link sent!")
    openAlertResetPassword()
  } catch (error) {
    console.log("Password reset link sending error!")
    dispatch({ type: "RESET_PASSWORD_ERROR", payload: error })
  }

  setSubmitting(false)
}

// Sign Out Member
export const signOut = (): ThunkActionCustom<void> => (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firebase = getFirebase()
  firebase.logout().catch((error) => {
    dispatch({ type: "SIGN_OUT_ERROR", payload: error })
    console.log(error)
  })
}

export const deleteAccount = (): ThunkActionCustom<void> => async (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  const firebase = getFirebase()

  const currentUser = firebase.auth().currentUser

  if (currentUser) {
    try {
      await currentUser.delete()
      await firebase.logout()
      dispatch(setProfileDialogOpen(false))
    } catch (error) {
      console.error(error)
    }
  }
}
