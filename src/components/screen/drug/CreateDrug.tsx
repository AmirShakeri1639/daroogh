import React, { Fragment, useReducer } from 'react';
import {
  Container,
  Paper,
  IconButton,
  TextField,
  FormControl,
  Checkbox,
  FormGroup,
  Button
} from '@material-ui/core';
import Drug from '../../../services/api/Drug';
import { DrugInterface } from '../../../interfaces/DrugInterface';
import { useMutation, useQuery } from "react-query";
import { makeStyles } from "@material-ui/core/styles";
import {ActionInterface} from "../../../interfaces";

const initialState: DrugInterface = {
  id: 0,
  categoryID: 0,
  name: '',
  genericName: '',
  companyName: '',
  barcode: '',
  description: '',
  active: false,
  enName: '',
  type: ''
};

function reducer(state = initialState, action: ActionInterface): any {
  switch (action.type) {
    case 'id':
      return {
        ...state,
        id: action.value,
      };
    case 'categoryID':
      return {
        ...state,
        categoryID: action.value,
      };
    case 'name':
      return {
        ...state,
        name: action.value,
      };
    case 'genericName':
      return {
        ...state,
        genericName: action.value,
      };
    case 'companyName':
      return {
        ...state,
        companyName: action.value,
      };
    case 'barcode':
      return {
        ...state,
        barcode: action.value,
      };
    case 'description':
      return {
        ...state,
        description: action.value,
      };
    case 'active':
      return {
        ...state,
        active: action.value,
      };
    case 'enName':
      return {
        ...state,
        enName: action.value,
      };
    case 'type':
      return {
        ...state,
        type: action.value,
      };
    case 'reset':
      return initialState;
    default:
      console.error('Action type not defined');
  }
}

