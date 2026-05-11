import { Component, type ErrorInfo, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { sieht_nach_chunk_fehler_aus } from '../app/chunkReload';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unerwarteter Fehler in der Anwendung:', error, info.componentStack);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const chunkProblem = sieht_nach_chunk_fehler_aus(error.message);

    return (
      <Box sx={{ maxWidth: 640, mx: 'auto', mt: { xs: 4, sm: 8 }, px: 2 }}>
        <Stack spacing={2}>
          <Alert severity="error">
            <AlertTitle>Etwas ist schiefgelaufen</AlertTitle>
            {chunkProblem
              ? 'Die Anwendung wurde wahrscheinlich gerade aktualisiert. Lade die Seite neu, um die neue Version zu holen.'
              : 'Die Anwendung ist auf einen unerwarteten Fehler gestoßen. Deine lokal gespeicherten Begutachtungen sind davon nicht betroffen.'}
          </Alert>
          {!chunkProblem ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {error.message}
            </Typography>
          ) : null}
          <Box>
            <Button variant="contained" onClick={this.handleReload}>
              Seite neu laden
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  }
}
