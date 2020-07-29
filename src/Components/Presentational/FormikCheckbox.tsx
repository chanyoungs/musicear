import { FormControl, FormControlLabel, FormHelperText } from '@material-ui/core'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import { FieldAttributes, useField } from 'formik'
import React, { FC } from 'react'

import { IAuthForm } from '../Pages/AuthPage/types'

export const FormikCheckBox: FC<
  FieldAttributes<{}> & {
    label: string
    name: keyof IAuthForm
  }
> = ({ label, placeholder, ...props }) => {
  const [field, meta] = useField<{}>({ ...props, type: "checkbox" })
  const errorText = meta.error && meta.touched ? meta.error : ""
  return (
    <FormControl required error={!!errorText} component="fieldset">
      <FormControlLabel
        control={<Checkbox {...field} color="primary" />}
        label={
          <Typography color="primary" variant="caption">
            {label}
          </Typography>
        }
      />
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  )
}
