import React from 'react';
import { create } from 'jss';
import rtl from 'jss-rtl';
import {
  StylesProvider,
  jssPreset,
  createMuiTheme,
} from '@material-ui/core/styles';
import Vazir from './assets/fonts/Vazir.woff';
import VazirBold from './assets/fonts/Vazir-Bold.woff';
import VazirFDMedium from './assets/fonts/Vazir-Medium-FD-WOL.woff';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

interface RTLProps {
  children: React.ReactNode;
}

function RTL(props: RTLProps): JSX.Element {
  return <StylesProvider jss={ jss }>{ props.children }</StylesProvider>;
}

export const theme = createMuiTheme({
  direction: 'rtl',
  palette: {
    gray: {
      light: '#ebedef',
      main: '#ced2d8',
      dark: '#636f83',
      // extra: '#232f3e',
    },
    blueLinearGradient: {
      main: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    },
    pinkLinearGradient: {
      main: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    },
    redLinearGradient: {
      main:
        'linear-gradient(45deg, rgba(208,15,15,1) 0%, rgba(121,9,13,1) 50%, rgba(255,0,0,1) 100%);',
    },
    greenLinearGradient: {
      main:
        'linear-gradient(45deg, rgba(15,208,47,1) 0%, rgba(9,121,39,1) 50%, rgba(0,255,29,1) 100%);',
    },
  },
  typography: {
    fontFamily: ['Vazir', 'VazirBold', 'VazirFontNumber'].join(","),
  },
});

export default RTL;

declare module '@material-ui/core/styles/createPalette' {
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
  interface Palette {
    redLinearGradient: Palette['primary'];
  }
  interface Palette {
    greenLinearGradient: Palette['primary'];
  }
  interface PaletteOptions {
    pinkLinearGradient: PaletteOptions['primary'];
    redLinearGradient: PaletteOptions['primary'];
    greenLinearGradient: PaletteOptions['primary'];
  }
}
