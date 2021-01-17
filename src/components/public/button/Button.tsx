import React from 'react';
import {
  Button as MaterialButton,
  createStyles,
  makeStyles,
} from '@material-ui/core';
import { ButtonPropsInterface } from '../../../interfaces/component';
import { green } from '@material-ui/core/colors';

const useClasses = makeStyles((theme) =>
  createStyles({
    blueButton: {
      background: theme.palette.blueLinearGradient.main,
    },
    pinkButton: {
      background: theme.palette.pinkLinearGradient.main,
    },
    redButton: {
      background: theme.palette.redLinearGradient.main,
    },
    greenButton: {
      background: theme.palette.greenLinearGradient.main,
    },
    bluegreenButton: {
      backgroundImage:
        'linear-gradient(90deg, #FF9A8B 0%, #FF6A88 55%, #FF99AC 100%)',
    },
    button: {
      color: '#fff',
      border: 'none',
    },
  })
);

const Button: React.FC<ButtonPropsInterface> = (props) => {
  const {
    type,
    children,
    variant,
    className,
    color,
    onClick,
    disabled,
  } = props;

  const {
    blueButton,
    pinkButton,
    button,
    redButton,
    greenButton,
    bluegreenButton,
  } = useClasses();

  return (
    <MaterialButton
      disabled={disabled}
      type={type}
      size="small"
      className={`${className} ${
        color === 'blue'
          ? blueButton
          : color === 'pink'
          ? pinkButton
          : color === 'red'
          ? redButton
          : color === 'bluegreen'
          ? bluegreenButton
          : greenButton
      } ${button}`}
      variant={variant}
      onClick={onClick}
    >
      {children}
    </MaterialButton>
  );
};

Button.defaultProps = {
  variant: 'outlined',
  type: 'button',
};

export default Button;
