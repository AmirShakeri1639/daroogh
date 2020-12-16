import React from 'react';
import { SwitchComponentPropsInterface } from "../../../interfaces";
import styled from 'styled-components';

const Label = styled.label`
  cursor: pointer;
  position: absolute;
  input {
    visibility: hidden;
    position: absolute;
  }
  #circle-container {
    position: relative;
    transition: .1s ease;
    border-radius: 16px;
    display: inline-block;
    background-color: #CECECE;
    width: 40px;
    height: 22px;
    span {
      transition: all .25s ease;
      top: 3px;
      right: 3px;
      position: absolute;
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #fff;
    }
  }

  input[type="checkbox"]:checked {
    & + #circle-container {
      background-color: #6200EE;
      span {
        transition: all .25s ease;
        right: 21px;
      }
    }
  }
`;

const Switch: React.FC<SwitchComponentPropsInterface> = (props) => {
  const { checked, id, onChange } = props;

  return (
    <Label htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span id="circle-container">
        <span />
      </span>
    </Label>
  );
}

export default Switch;
