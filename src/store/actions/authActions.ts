import { IResetPassword, ISignIn, ISignUp } from 'src/Components/Pages/AuthPage/types'

import { auth } from '../../firebase'
import { ThunkActionCustom } from './types'

// Sign Up Member
export const signUp = ({
  email,
  password,
  username,
  setSubmitting,
  openAlert: openAlertSignUp,
}: ISignUp): ThunkActionCustom<void> => (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  setSubmitting(true)
  const firestore = getFirestore()
  const firebase = getFirebase()
  firebase
    .createUser({ email, password })
    .then(() => {
      console.log(firebase.auth().currentUser?.uid)
      firestore
        .collection("usernames")
        .doc(firebase.auth().currentUser?.uid)
        .set({ username })
        .then(() => {
          openAlertSignUp()
          setSubmitting(false)
        })
        .catch((error) => {
          console.error(error)
        })
    })
    .catch((error) => {
      dispatch({ type: "SIGN_UP_ERROR", payload: error })
      console.log(error)
      setSubmitting(false)
    })
}

// Sign In Member
export const signIn = ({
  email,
  password,
  rememberMe,
  setSubmitting,
}: ISignIn): ThunkActionCustom<void> => (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  setSubmitting(true)
  console.log("Remember me: ", rememberMe)

  const firebase = getFirebase()

  firebase
    .auth()
    .setPersistence(
      rememberMe ? auth.Auth.Persistence.LOCAL : auth.Auth.Persistence.SESSION // There are some type definition missing on ExtendedFirebaseInstance and so used original auth function from firebase
    )
    .then(() => {
      firebase
        .login({ email, password })
        .then((userCredentials) => {
          console.log("Sign in succesful!")
        })
        .catch((error) => {
          dispatch({ type: "SIGN_IN_ERROR", payload: error })
          console.log(error)
          setSubmitting(false)
          console.log("autherror", getState().firebase.authError)
        })
    })
    .catch((error) => {
      dispatch({ type: "REMEMBER_ME_ERROR", payload: error })
      console.log(error)
      setSubmitting(false)
    })
}

// Send reset password link
export const resetPassword = ({
  email,
  setSubmitting,
  openAlert: openAlertResetPassword,
}: IResetPassword): ThunkActionCustom<void> => (
  dispatch,
  getState,
  { getFirestore, getFirebase }
) => {
  setSubmitting(true)
  const firebase = getFirebase()
  firebase
    .resetPassword(email)
    .then(() => {
      console.log("Password reset link sent!")
      openAlertResetPassword()
      setSubmitting(false)
    })
    .catch((error) => {
      console.log("Password reset link sending error!")
      dispatch({ type: "RESET_PASSWORD_ERROR", payload: error })
      setSubmitting(false)
    })
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
