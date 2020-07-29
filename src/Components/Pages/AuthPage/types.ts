// ---Auth---
// Types
export type AuthTypes = {
  email: string
  password: string
  username: string
  photoUrl: string
  rememberMe: boolean
  page: "signIn" | "signUp" | "resetPassword"
  alertResetPassword: boolean
  alertSignUp: boolean
  setSubmitting: (isSubmitting: boolean) => void
  openAlert: () => void
}

// Auth Interface
export type IResetPassword = Pick<
  AuthTypes,
  "email" | "setSubmitting" | "openAlert"
>
export type ISignIn = Pick<
  AuthTypes,
  "email" | "password" | "rememberMe" | "setSubmitting"
>
export type ISignUp = Pick<
  AuthTypes,
  "email" | "password" | "username" | "setSubmitting" | "openAlert"
>
export type IAuthForm = Pick<
  AuthTypes,
  | "email"
  | "password"
  | "username"
  | "rememberMe"
  | "page"
  | "alertResetPassword"
  | "alertSignUp"
>
