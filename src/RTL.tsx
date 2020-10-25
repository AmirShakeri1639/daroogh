import React from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import { StylesProvider, jssPreset, createMuiTheme } from '@material-ui/core/styles';
import Vazir from './assets/fonts/Vazir.woff';
import VazirBold from './assets/fonts/Vazir-Bold.woff';

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

const vazirBold = {
  fontFamily: 'VazirBold',
  fontWeight: 'normal',
  src: `url(${VazirBold}) format(woff)`,
};

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    gray: Palette['primary'];
  }
  interface PaletteOptions {
    gray: PaletteOptions['primary'];
  }
  interface Palette {
    blueLinearGradient: Palette['primary'];
  }
  interface PaletteOptions {
    blueLinearGradient: PaletteOptions['primary'];
  }
  interface Palette {
    pinkLinearGradient: Palette['primary'];
  }
  interface PaletteOptions {
    pinkLinearGradient: PaletteOptions['primary'];
  }
}

export const theme = createMuiTheme({
  direction: 'rtl',
  palette: {
    gray: {
      light: '#ebedef',
      main: '#ced2d8',
      dark: '#636f83',
    },
    blueLinearGradient: {
      main: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    },
    pinkLinearGradient: {
      main: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    }
  },
  typography: {
    fontFamily: 'Vazir'
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [
          vazirFont,
          vazirBold,
        ],
      },
    },
  },
});

export default RTL;
