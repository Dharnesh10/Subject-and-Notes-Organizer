import { Outlet } from 'react-router-dom';
import PersistentDrawerLeft from './PersistentDrawerLeft';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function Layout() {
  const theme = createTheme({
  palette: {
    primary: {
      main: "#2d232e", // green instead of blue
    },
  },
});
  return (
    <ThemeProvider theme={theme}>
      <PersistentDrawerLeft>
        <Outlet />
      </PersistentDrawerLeft>
    </ThemeProvider>
  );
}
