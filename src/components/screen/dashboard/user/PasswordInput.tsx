import React, { FC } from 'react';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

interface Props {
  error?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  label?: string;
  onClickIcon: () => void;
  isVisiblePassword: boolean;
  helperText?: string
}

const PasswordInput: FC<Props> = ({
  error,
  onChange,
  value,
  label,
  onClickIcon,
  isVisiblePassword,
  helperText,
}) => {
  return (
    <TextField
      error={error}
      variant="outlined"
      margin="normal"
      value={value}
      required
      fullWidth
      helperText={ helperText }
      className="text-field"
      name="password"
      label={label}
      type={isVisiblePassword ? 'text' : 'password'}
      id="password"
      onChange={onChange}
      autoComplete="current-password"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon icon={faKey} size="lg" color="#3607a5" />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton aria-label="toggle password visibility" onClick={onClickIcon} edge="end">
              {isVisiblePassword ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
