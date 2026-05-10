import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { useThemeMode } from './theme/useThemeMode';

export function AppShell() {
  const { mode, toggle } = useThemeMode();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" color="default" enableColorOnDark>
        <Toolbar sx={{ gap: 2 }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 600,
              flexGrow: 1,
            }}
          >
            Pflegesachverständigen-Hub
          </Typography>
          <Tooltip title={mode === 'dark' ? 'Helles Design' : 'Dunkles Design'}>
            <IconButton onClick={toggle} aria-label="Theme umschalten" color="inherit">
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: 14,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        Lokal im Browser gespeichert · Keine Übertragung an Server
      </Box>
    </Box>
  );
}
