import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link as RouterLink } from 'react-router-dom';

export function BegutachtungPlaceholder() {
  return (
    <Stack spacing={3}>
      <Typography variant="h1">Begutachtungsinstrument</Typography>
      <Alert severity="info">
        Dieses Tool befindet sich im Aufbau. Domain-Logik, Erfassungsoberfläche und PDF-Export folgen
        in den nächsten Schritten.
      </Alert>
      <div>
        <Button component={RouterLink} to="/" variant="outlined">
          Zurück zum Hub
        </Button>
      </div>
    </Stack>
  );
}
