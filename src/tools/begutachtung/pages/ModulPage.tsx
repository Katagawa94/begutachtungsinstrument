import { useMemo } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getModul } from '../domain/modules';
import { berechneModulErgebnis } from '../domain/scoring';
import { useBegutachtungen } from '../state/useBegutachtungen';
import { KriteriumCard } from '../components/KriteriumCard';
import { buildSteps } from '../navigation';
import type { Bewertung } from '../domain/types';

export function ModulPage() {
  const { id = '', modulId: modulIdParam = '' } = useParams<{ id: string; modulId: string }>();
  const navigate = useNavigate();
  const { finden, bewertungSetzen } = useBegutachtungen();
  const begutachtung = finden(id);

  const modulIdNum = Number(modulIdParam);
  const modul = Number.isFinite(modulIdNum) ? safeGetModul(modulIdNum) : null;

  const ergebnis = useMemo(() => {
    if (!modul || !begutachtung) return null;
    return berechneModulErgebnis(modul, begutachtung.bewertungen);
  }, [modul, begutachtung]);

  if (!begutachtung || !modul || !ergebnis) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h1">Modul nicht gefunden</Typography>
        <Alert severity="warning">
          {begutachtung
            ? `Modul ${modulIdParam} ist unbekannt. Wähle ein Modul von 1 bis 6.`
            : 'Die angeforderte Begutachtung existiert nicht (mehr).'}
        </Alert>
        <Button component={RouterLink} to="/begutachtung" variant="contained">
          Zur Übersicht
        </Button>
      </Stack>
    );
  }

  const steps = buildSteps(id);
  const aktuellerIndex = steps.findIndex(
    (s) => s.kind === 'modul' && s.modulId === modul.id,
  );
  const vorherigerStep = aktuellerIndex > 0 ? steps[aktuellerIndex - 1] : undefined;
  const naechsterStep = aktuellerIndex < steps.length - 1 ? steps[aktuellerIndex + 1] : undefined;

  const handleBewertung = (kriteriumId: string, bewertung: Partial<Bewertung>) => {
    bewertungSetzen(id, kriteriumId, bewertung);
  };

  return (
    <Stack spacing={3} sx={{ pb: 12 }}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
          Modul {modul.id} · Gewichtung {modul.gewichtungProzent}%
        </Typography>
        <Typography variant="h1">{modul.name}</Typography>
      </Box>

      <Accordion variant="outlined" disableGutters defaultExpanded={false}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">Hinweise zu diesem Modul</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="text.secondary">
            {modul.einleitung}
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Stack spacing={2}>
        {modul.kriterien.map((k) => (
          <KriteriumCard
            key={k.id}
            kriterium={k}
            bewertung={begutachtung.bewertungen[k.id]}
            onChange={(b) => handleBewertung(k.id, b)}
          />
        ))}
      </Stack>

      <Paper
        elevation={6}
        sx={{
          position: 'sticky',
          bottom: { xs: 8, sm: 16 },
          p: 2,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexWrap: 'wrap',
          zIndex: 2,
        }}
      >
        <Stack spacing={0.5} sx={{ flexGrow: 1, minWidth: 220 }}>
          <Typography variant="body2">
            <strong>{ergebnis.bewerteteKriterien}</strong> / {ergebnis.kriterienAnzahl} Kriterien
            bewertet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {ergebnis.einzelpunkte} Einzelpunkte · {ergebnis.gewichtetePunkte} gewichtete Punkte ·{' '}
            <em>{ergebnis.schweregradBezeichnung}</em>
          </Typography>
        </Stack>
        <Chip
          color={ergebnis.gewichtetePunkte > 0 ? 'primary' : 'default'}
          label={`SG ${ergebnis.schweregrad}`}
          aria-label={`Schweregrad ${ergebnis.schweregrad}`}
        />
        <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
          <Button
            variant="outlined"
            disabled={!vorherigerStep}
            onClick={() => vorherigerStep && navigate(vorherigerStep.pfad)}
          >
            Zurück
          </Button>
          <Button
            variant="contained"
            disabled={!naechsterStep}
            onClick={() => naechsterStep && navigate(naechsterStep.pfad)}
          >
            Weiter
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

function safeGetModul(id: number) {
  try {
    return getModul(id);
  } catch {
    return null;
  }
}
