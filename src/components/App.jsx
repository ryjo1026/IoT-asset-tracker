import React from 'react';
import Router from './Router.jsx';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#5e92f3',
      main: '#1565c0',
      dark: '#003c8f',
      contrastText: '#fff',
    },
    secondary: {
      light: '#fdd835',
      main: '#ffff6b',
      dark: '#c6a700',
      contrastText: '#000',
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
      <Router />
  </MuiThemeProvider>
);

export default App;
