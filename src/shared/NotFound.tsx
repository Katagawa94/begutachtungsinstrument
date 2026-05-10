import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

export function NotFound() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h1">Seite nicht gefunden</Typography>
      <Typography color="text.secondary">
        Die angeforderte Seite existiert nicht.
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Zurück zum Hub
      </Button>
    </Stack>
  );
}
