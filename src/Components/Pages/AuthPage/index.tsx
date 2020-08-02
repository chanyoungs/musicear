import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import Grid from '@material-ui/core/Grid'
import Link from '@material-ui/core/Link'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Email from '@material-ui/icons/Email'
import Lock from '@material-ui/icons/Lock'
import Person from '@material-ui/icons/Person'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { FC, Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { functions } from 'src/firebase'
import { resetPassword, signIn, signUp } from 'src/store/actions/authActions'
import { AppState } from 'src/store/reducers/rootReducer'
import * as yup from 'yup'

import { AlertDialog } from '../../Presentational/AlertDialog'
import { ChangeSignInUpButton } from '../../Presentational/ChangeSignInUpButton'
import { ContainerMain } from '../../Presentational/CustomContainer'
import { FormikCheckBox } from '../../Presentational/FormikCheckbox'
import { FormikTextField } from '../../Presentational/FormikTextField'
import Logo from '../../Presentational/logo192.png'
import { IAuthForm } from './types'

// import { Redirect, useHistory, useLocation } from 'react-router-dom'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minHeight: "100vh",
      padding: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    grid: {
      flex: 1,
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
      paddingBottom: theme.spacing(5),
    },

    signInUpButton: {
      textTransform: "none",
      background: theme.palette.primary.light,
    },
    logo: {
      width: theme.spacing(10),
      flex: 1,
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(5),
    },
    footer: {
      bottom: 0,
    },
    buttonWrapper: {
      position: "relative",
      padding: 0,
    },
    progress: {
      color: theme.palette.secondary.light,
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -24,
      marginLeft: -24,
      zIndex: 1,
    },
  })
)

export const AuthPage: FC = () => {
  const classes = useStyles()
  const dispatch = useDispatch()

  // Define 'isMounted' flag using ref
  const isMounted = useRef(true)
  useEffect(() => () => {
    isMounted.current = false
  })

  const authError = useSelector<AppState, AppState["auth"]>(
    (state) => state.auth
  )

  const checkUsernameAvailable = (username: string) =>
    new Promise<boolean>(async (resolve, reject) => {
      try {
        const result = await functions.httpsCallable("checkUsernameAvailable")({
          username,
        })
        const usernameAvailable: boolean = result.data.usernameAvailable
        resolve(usernameAvailable)
      } catch (error) {
        reject(error)
      }
    })
  const validationSchema = yup.object<Partial<IAuthForm>>({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().when("page", {
      is: (page: IAuthForm["page"]) => page === "signIn" || page === "signUp",
      then: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    username: yup.string().when("page", {
      is: "signUp",
      then: yup.string().required("Username is required").test(
        "checkUsernameAvailable",
        "This username already exists",
        checkUsernameAvailable
        // username =>
        // new Promise<boolean>(async (resolve, reject) => {
        //   try {
        //     const querySnapshot = await firestore
        //       .collection("usernames")
        //       .where("username", "==", username || "")
        //       .get()
        //     resolve(querySnapshot.empty)
        //   } catch (error) {
        //     console.error(error)
        //     reject(error)
        //   }
        // })
      ),
    }),
  })

  const initialValues: IAuthForm = {
    email: "",
    password: "",
    username: "",
    rememberMe: false,
    page: "signIn",
    alertResetPassword: false,
    alertSignUp: false,
  }

  const onSubmit = (
    values: IAuthForm,
    { setSubmitting, setFieldValue }: FormikHelpers<IAuthForm>
  ) => {
    const { email, password, username, rememberMe, page } = values

    const setSubmittingIfMounted: typeof setSubmitting = (...props) => {
      isMounted.current && setSubmitting(...props)
    }

    const setFieldValueIfMounted: typeof setFieldValue = (...props) => {
      isMounted.current && setFieldValue(...props)
    }

    const openAlertResetPassword = () =>
      setFieldValueIfMounted("alertResetPassword", true)

    const openAlertSignUp = () => setFieldValueIfMounted("alertSignUp", true)

    switch (page) {
      case "signIn":
        dispatch(
          signIn({
            email,
            password,
            rememberMe,
            setSubmitting: setSubmittingIfMounted,
          })
        )
        break

      case "signUp":
        dispatch(
          signUp({
            email,
            password,
            username,
            setSubmitting: setSubmittingIfMounted,
            openAlert: openAlertSignUp,
          })
        )
        break

      case "resetPassword":
        dispatch(
          resetPassword({
            email,
            setSubmitting: setSubmittingIfMounted,
            openAlert: openAlertResetPassword,
          })
        )
        break
    }
  }

  return (
    <Fragment>
      <Formik<IAuthForm>
        validateOnChange
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, isValid, dirty, isSubmitting, setFieldValue }) => (
          <Form className={classes.root}>
            <img src={Logo} className={classes.logo} alt="GVC Logo" />
            <div className={classes.grid}>
              <ContainerMain>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item xs={12}>
                    <FormikTextField
                      label="Email Address"
                      placeholder="johnsmith@gmail.com"
                      name="email"
                      icon={<Email />}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    {values.page !== "resetPassword" && (
                      <FormikTextField
                        label="Password"
                        placeholder="Password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        icon={<Lock />}
                      />
                    )}
                  </Grid>

                  {values.page === "signUp" && (
                    <Grid item xs={12}>
                      <FormikTextField
                        label="Username"
                        placeholder="username123"
                        name="username"
                        icon={<Person />}
                      />
                    </Grid>
                  )}
                  <Grid item xs>
                    {values.page === "signIn" && (
                      <FormikCheckBox name="rememberMe" label="Remember me" />
                    )}
                  </Grid>
                  <Grid item>
                    {values.page === "signIn" && (
                      <Link
                        onClick={() => setFieldValue("page", "resetPassword")}
                        display="block"
                        align="center"
                        variant="caption"
                        color="inherit"
                      >
                        Forgot Password?
                      </Link>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      required
                      error={
                        values.page === "signIn"
                          ? !!authError.signInError
                          : values.page === "signUp"
                          ? !!authError.signUpError
                          : !!authError.resetPasswordError
                      }
                      component="fieldset"
                      fullWidth
                    >
                      <div className={classes.buttonWrapper}>
                        <Button
                          className={classes.signInUpButton}
                          variant="contained"
                          fullWidth
                          disabled={isSubmitting || !isValid || !dirty}
                          type="submit"
                        >
                          <Typography color="textPrimary">
                            {values.page === "signIn" && "Sign in"}
                            {values.page === "signUp" && "Sign up"}
                            {values.page === "resetPassword" &&
                              "Email me reset password link"}
                          </Typography>
                        </Button>
                        {isSubmitting && (
                          <CircularProgress
                            size={48}
                            className={classes.progress}
                          />
                        )}
                      </div>
                      <FormHelperText>
                        {values.page === "signIn" &&
                          authError.signInError?.message}
                        {values.page === "signUp" &&
                          authError.signUpError?.message}
                        {values.page === "resetPassword" &&
                          (authError.resetPasswordError
                            ? authError.resetPasswordError?.message
                            : authError.resetPasswordSuccess)}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  {values.page === "resetPassword" && (
                    <Grid item xs>
                      <Link
                        onClick={() => setFieldValue("page", "signIn")}
                        display="block"
                        align="center"
                        variant="caption"
                        color="inherit"
                      >
                        Return to sign in page?
                      </Link>
                    </Grid>
                  )}
                </Grid>
              </ContainerMain>
            </div>
            <AlertDialog
              title="Password reset link sent!"
              content="Password reset link has been sent to your email. Please check your email to reset your password, and then come back to sign in."
              open={values.alertResetPassword}
              handleClose={() => {
                setFieldValue("alertResetPassword", false)
                setFieldValue("page", "signIn")
              }}
            />
            <AlertDialog
              title="Sign up successful!"
              content="Please now sign in"
              open={values.alertSignUp}
              handleClose={() => {
                setFieldValue("alertSignUp", false)
                setFieldValue("page", "signIn")
              }}
            />
            <AppBar position="sticky" className={classes.footer}>
              <ChangeSignInUpButton
                page={values.page}
                onClick={() => {
                  values.page !== "signUp"
                    ? setFieldValue("page", "signUp")
                    : setFieldValue("page", "signIn")
                }}
              />
            </AppBar>
          </Form>
        )}
      </Formik>
    </Fragment>
  )
}
