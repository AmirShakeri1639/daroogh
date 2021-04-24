import React from 'react'
import { TextField, TextFieldProps } from '@material-ui/core'
import Utils from '../utility/Utils'

type Props = TextFieldProps & {
  maxLength?: number
}

const NumberField: React.FC<Props> = (props) => {
  const {
    onChange,
    maxLength,
  } = props

  // to prevent double "type" property
  if (props.type) delete props.type

  return (
    <TextField
      { ...props }
      type="text"
      onChange={ (e): void => {
        let targetValue = Utils.fixNumbers(e.target.value)

        if (isNaN(+targetValue)) return
        if (maxLength && targetValue.length > maxLength) return

        e.target.value = targetValue
        if (onChange) onChange(e)
      } }
    />
  )
}

export default NumberField
