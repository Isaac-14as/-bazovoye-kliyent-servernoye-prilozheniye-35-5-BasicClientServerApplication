import { CssBaseline, ThemeProvider } from '@mui/material';
import { Router } from "./router";
import theme from "./theme";
import "./styles.css";

export const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router /> 
    </ThemeProvider>
  );
};
