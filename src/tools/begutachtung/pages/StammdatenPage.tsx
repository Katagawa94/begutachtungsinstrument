import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid2';
import { useBegutachtungen } from '../state/useBegutachtungen';
import type { Stammdaten } from '../state/schema';
import { leereStammdaten } from '../state/schema';

export function StammdatenPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { finden, stammdatenAktualisieren } = useBegutachtungen();
  const begutachtung = finden(id);

  const [draft, setDraft] = useState<Stammdaten>(begutachtung?.stammdaten ?? leereStammdaten());
  const [gespeichert, setGespeichert] = useState(false);

  useEffect(() => {
    if (begutachtung) setDraft(begutachtung.stammdaten);
  }, [begutachtung]);

  if (!begutachtung) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h1">Begutachtung nicht gefunden</Typography>
        <Alert severity="warning">
          Die angeforderte Begutachtung existiert nicht (mehr).
        </Alert>
        <Button component={RouterLink} to="/begutachtung" variant="contained">
          Zur Übersicht
        </Button>
      </Stack>
    );
  }

  function setFeld<S extends keyof Stammdaten, F extends keyof Stammdaten[S]>(
    bereich: S,
    feld: F,
    wert: Stammdaten[S][F],
  ) {
    setDraft((prev) => ({
      ...prev,
      [bereich]: { ...prev[bereich], [feld]: wert },
    }));
  }

  function handleSpeichern() {
    stammdatenAktualisieren(id, draft);
    setGespeichert(true);
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Stammdaten</Typography>
        <Typography color="text.secondary">
          Diese Angaben erscheinen auf dem Deckblatt der späteren PDF-Auswertung.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Begutachtete Person
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Name"
              fullWidth
              value={draft.person.name}
              onChange={(e) => setFeld('person', 'name', e.target.value)}
              autoComplete="off"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Geburtsdatum"
              type="date"
              fullWidth
              value={draft.person.geburtsdatum}
              onChange={(e) => setFeld('person', 'geburtsdatum', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Gutachter:in
        </Typography>
        <TextField
          label="Name der pflegesachverständigen Person"
          fullWidth
          value={draft.gutachter.name}
          onChange={(e) => setFeld('gutachter', 'name', e.target.value)}
          autoComplete="off"
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Begutachtungstermin
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Datum"
              type="date"
              fullWidth
              value={draft.termin.datum}
              onChange={(e) => setFeld('termin', 'datum', e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 8 }}>
            <TextField
              label="Ort"
              fullWidth
              value={draft.termin.ort}
              onChange={(e) => setFeld('termin', 'ort', e.target.value)}
              autoComplete="off"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Pflegekasse
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Träger"
              fullWidth
              value={draft.versicherung.traeger}
              onChange={(e) => setFeld('versicherung', 'traeger', e.target.value)}
              autoComplete="off"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Aktenzeichen"
              fullWidth
              value={draft.versicherung.aktenzeichen}
              onChange={(e) => setFeld('versicherung', 'aktenzeichen', e.target.value)}
              autoComplete="off"
            />
          </Grid>
        </Grid>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button component={RouterLink} to="/begutachtung" variant="outlined">
          Zur Übersicht
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleSpeichern} variant="outlined">
          Speichern
        </Button>
        <Button
          component={RouterLink}
          to={`/begutachtung/${id}/modul/1`}
          variant="contained"
          onClick={() => stammdatenAktualisieren(id, draft)}
        >
          Weiter zu Modul 1
        </Button>
      </Stack>

      <Snackbar
        open={gespeichert}
        autoHideDuration={2500}
        onClose={() => setGespeichert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setGespeichert(false)} variant="filled">
          Stammdaten gespeichert.
        </Alert>
      </Snackbar>
    </Stack>
  );
}
