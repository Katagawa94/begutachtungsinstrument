import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { useThemeMode } from './theme/useThemeMode';

const HAUPTINHALT_ID = 'hauptinhalt';

export function AppShell() {
  const { mode, toggle } = useThemeMode();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Link
        href={`#${HAUPTINHALT_ID}`}
        sx={{
          position: 'absolute',
          left: 8,
          top: 8,
          zIndex: (theme) => theme.zIndex.modal + 1,
          px: 2,
          py: 1,
          borderRadius: 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 3,
          transform: 'translateY(-200%)',
          transition: 'transform 120ms ease',
          '&:focus-visible': { transform: 'translateY(0)' },
        }}
      >
        Zum Hauptinhalt springen
      </Link>
      <AppBar position="sticky" color="default" enableColorOnDark>
        <Toolbar sx={{ gap: 1 }}>
          <Typography
            component={RouterLink}
            to="/"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 600,
              flexGrow: 1,
              fontSize: { xs: '1rem', sm: '1.25rem' },
              lineHeight: 1.2,
            }}
          >
            Pflegesachverständigen-Hub
          </Typography>
          <Tooltip title={mode === 'dark' ? 'Helles Design' : 'Dunkles Design'}>
            <IconButton
              onClick={toggle}
              aria-label={mode === 'dark' ? 'Zum hellen Design wechseln' : 'Zum dunklen Design wechseln'}
              color="inherit"
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        id={HAUPTINHALT_ID}
        maxWidth="lg"
        sx={{ py: { xs: 2, sm: 4 }, px: { xs: 2, sm: 3 }, flexGrow: 1 }}
      >
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
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
