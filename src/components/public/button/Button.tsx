import React from 'react';
import {
  Button as MaterialButton, createStyles, makeStyles, useTheme
} from '@material-ui/core';
import { ButtonPropsInterface } from '../../../interfaces/component';

const useClasses = makeStyles((theme) => createStyles({
  blueButton: {
    background: theme.palette.blueLinearGradient.main,
  },
  pinkButton: {
    background: theme.palette.pinkLinearGradient.main,
  },
  button: {
    color: '#fff',
    border: 'none',
  }
}));

const Button: React.FC<ButtonPropsInterface> = (props) => {

  const {
    type, children, variant, className,
    color,
  } = props;

  const { blueButton, pinkButton, button } = useClasses();

  return (
    <MaterialButton
      type={type}
      size="small"
      className={`${className} ${color === 'blue' ? blueButton : pinkButton } ${button}`}
      variant={variant}
    >
      {children}
    </MaterialButton>
  )
}

Button.defaultProps = {
  variant: 'outlined',
  type: 'button',
}

export default Button;