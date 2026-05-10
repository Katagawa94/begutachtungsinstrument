import { useMemo } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useBegutachtungen } from '../state/useBegutachtungen';
import { berechneGesamtergebnis } from '../domain/scoring';
import { MODULE } from '../domain/modules';

export function AbschlussPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { finden } = useBegutachtungen();
  const begutachtung = finden(id);

  const ergebnis = useMemo(() => {
    if (!begutachtung) return null;
    return berechneGesamtergebnis(begutachtung.bewertungen);
  }, [begutachtung]);

  if (!begutachtung || !ergebnis) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h1">Begutachtung nicht gefunden</Typography>
        <Alert severity="warning">Die angeforderte Begutachtung existiert nicht (mehr).</Alert>
        <Button component={RouterLink} to="/begutachtung" variant="contained">
          Zur Übersicht
        </Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Abschluss</Typography>
        <Typography color="text.secondary">
          Vorläufige Zusammenfassung. Detailansicht und PDF-Export folgen im nächsten Schritt.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ sm: 'center' }}
          sx={{ mb: 2 }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2" component="div">
              {ergebnis.gesamtpunkte} gewichtete Punkte
            </Typography>
            <Typography color="text.secondary">{ergebnis.pflegegradBezeichnung}</Typography>
          </Box>
          <Chip
            color={ergebnis.pflegegrad > 0 ? 'primary' : 'default'}
            label={ergebnis.pflegegrad > 0 ? `PG ${ergebnis.pflegegrad}` : 'kein Pflegegrad'}
            sx={{ fontSize: 16, py: 2.5, px: 1 }}
          />
        </Stack>
        <Stack spacing={1}>
          {MODULE.map((modul) => {
            const erg = ergebnis.modulErgebnisse.find((e) => e.modulId === modul.id);
            if (!erg) return null;
            const ausgegraut = erg.fliesstInGesamtwertungEin === false;
            return (
              <Box
                key={modul.id}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                  gap: 1,
                  opacity: ausgegraut ? 0.55 : 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 220 }}>
                  Modul {modul.id} — {modul.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {erg.einzelpunkte} Einzelpunkte · SG {erg.schweregrad}
                </Typography>
                <Typography variant="body2">
                  <strong>{erg.gewichtetePunkte}</strong> gew. P.
                </Typography>
                {ausgegraut ? (
                  <Chip size="small" variant="outlined" label="zählt nicht (M2/M3-Regel)" />
                ) : null}
              </Box>
            );
          })}
        </Stack>
      </Paper>

      <Stack direction="row" spacing={2}>
        <Button component={RouterLink} to="/begutachtung" variant="outlined">
          Zur Übersicht
        </Button>
      </Stack>
    </Stack>
  );
}
