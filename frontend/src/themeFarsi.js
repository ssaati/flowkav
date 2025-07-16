import { createTheme } from '@mui/material/styles';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';

// RTL Cache
export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// RTL Theme
export const rtlTheme = createTheme({
  direction: 'rtl',
  fontFamily: 'Yekan Bakh FaNum Regular',
  typography: {
    fontFamily: 'Yekan Bakh FaNum Regular',
    allVariants: {
      fontFamily: '"Yekan Bakh FaNum Regular"', // Force ALL text
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
		  font-family: 'Yekan Bakh FaNum Regular';
		  src: url('fonts/YekanBakh/woff/YekanBakhFaNum-Regular.woff');
          font-display: swap;
        }`
    },
    MuiTypography: {
      defaultProps: {
        dir: 'rtl',
      },
    },
	MuiTextField: {
	styleOverrides: {
	  root: {
		textAlign: 'right',
		fontFamily: '"Yekan Bakh FaNum Regular" !important',
	  },
	},
	},
	MuiInputLabel: {
	styleOverrides: {
	  root: {
		right: 0,
		left: 'auto',
		transformOrigin: 'top right',
		fontFamily: '"Yekan Bakh FaNum Regular" !important',
	  },
	},
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: '"Yekan Bakh FaNum Regular" !important',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        fontFamily: '"Yekan Bakh FaNum Regular"',
      },
    },
	},
  },
});
