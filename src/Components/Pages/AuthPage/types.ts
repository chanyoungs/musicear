// ---Auth---
// Types
export type AuthTypes = {
  email: string
  password: string
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
  "email" | "password" | "setSubmitting" | "openAlert"
>
export type IAuthForm = Pick<
  AuthTypes,
  | "email"
  | "password"
  | "rememberMe"
  | "page"
  | "alertResetPassword"
  | "alertSignUp"
>
