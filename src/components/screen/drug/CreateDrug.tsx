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
import { useMutation, useQuery } from "react-query";
