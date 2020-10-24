import React from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset, createMuiTheme } from '@material-ui/core/styles';
// @ts-ignore
import Vazir from './assets/fonts/Vazir.woff';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

interface RTLProps {
  children: React.ReactNode;
}

function RTL(props: RTLProps): JSX.Element {
  return (
    <StylesProvider jss={jss}>
      {props.children}
    </StylesProvider>
  );
}

const vazirFont = {
  fontFamily: 'Vazir',
  fontWeight: 'normal',
  src: `url(${Vazir}) format(woff)`,
};

export const theme = createMuiTheme({
  direction: 'rtl',
  typography: {
    fontFamily: 'Vazir'
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          vazirFont,
        ],
      },
    },
  },
});

export default RTL;
