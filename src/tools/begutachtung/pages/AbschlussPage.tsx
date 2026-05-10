import { useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import CircularProgress from '@mui/material/CircularProgress';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { useBegutachtungen } from '../state/useBegutachtungen';
import { berechneFortschritt } from '../domain/scoring';
import { MODULE } from '../domain/modules';
import { buildPdfData } from '../pdf/pdfData';
import { downloadBegutachtungPdf } from '../pdf/download';
import { exportiereAlsJson } from '../state/storage';
import { downloadAlsDatei } from '../utils/download';
import { downloadDateinameFuer, formatDate } from '../utils/format';

export function AbschlussPage() {
  const { id = '' } = useParams<{ id: string }>();
  const { finden } = useBegutachtungen();
  const begutachtung = finden(id);

  const pdfData = useMemo(() => {
    if (!begutachtung) return null;
    return buildPdfData(begutachtung);
  }, [begutachtung]);

  const [pdfLaedt, setPdfLaedt] = useState(false);
  const [meldung, setMeldung] = useState<{ schwere: 'success' | 'error'; text: string } | null>(
    null,
  );

  if (!begutachtung || !pdfData) {
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

  const { ergebnis, module } = pdfData;
  const fortschritt = berechneFortschritt(begutachtung.bewertungen);

  async function handlePdf() {
    if (!begutachtung) return;
    setPdfLaedt(true);
    try {
      await downloadBegutachtungPdf(begutachtung);
      setMeldung({ schwere: 'success', text: 'PDF wurde erzeugt.' });
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Unbekannter Fehler';
      setMeldung({ schwere: 'error', text: `PDF-Erstellung fehlgeschlagen: ${text}` });
    } finally {
      setPdfLaedt(false);
    }
  }

  function handleJsonExport() {
    if (!begutachtung) return;
    downloadAlsDatei(exportiereAlsJson(begutachtung), downloadDateinameFuer(begutachtung));
  }

  const kommentare = module.flatMap((m) =>
    m.kriterien
      .filter((k) => k.kommentar.trim().length > 0)
      .map((k) => ({ modulId: m.id, modulName: m.name, ...k })),
  );

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Abschluss</Typography>
        <Typography color="text.secondary">
          Zusammenfassung der Begutachtung sowie Export als PDF oder JSON.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="overline" color="text.secondary">
              Pflegegrad
            </Typography>
            <Typography variant="h2" sx={{ color: 'primary.main', fontWeight: 700 }}>
              {ergebnis.pflegegrad === 0 ? 'Kein Pflegegrad' : `PG ${ergebnis.pflegegrad}`}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {ergebnis.pflegegradBezeichnung}
            </Typography>
            <Typography variant="body2">
              <strong>{ergebnis.gesamtpunkte}</strong> gewichtete Punkte ·{' '}
              {fortschritt.bewertet}/{fortschritt.gesamt} Kriterien bewertet
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="overline" color="text.secondary">
              Stammdaten
            </Typography>
            <Stammdatenblock pdfData={pdfData} />
          </Grid>
        </Grid>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Modulübersicht
        </Typography>
        <Stack divider={<Divider />}>
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
                  py: 1,
                  opacity: ausgegraut ? 0.55 : 1,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600, minWidth: 240 }}>
                  Modul {modul.id} — {modul.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {erg.einzelpunkte} Einzelpunkte · SG {erg.schweregrad} ·{' '}
                  {erg.bewerteteKriterien}/{erg.kriterienAnzahl} bewertet
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

      {kommentare.length > 0 ? (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Kommentare ({kommentare.length})
          </Typography>
          <Stack spacing={1.5}>
            {kommentare.map((k) => (
              <Box key={`${k.modulId}-${k.id}`}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {k.id} — {k.bezeichnung}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {k.kommentar}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      ) : null}

      <Stack direction="row" spacing={2} flexWrap="wrap">
        <Button component={RouterLink} to="/begutachtung" variant="outlined">
          Zur Übersicht
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleJsonExport}
        >
          Als JSON exportieren
        </Button>
        <Button
          variant="contained"
          startIcon={pdfLaedt ? <CircularProgress size={18} color="inherit" /> : <PictureAsPdfIcon />}
          onClick={handlePdf}
          disabled={pdfLaedt}
        >
          PDF herunterladen
        </Button>
      </Stack>

      <Snackbar
        open={meldung !== null}
        autoHideDuration={4000}
        onClose={() => setMeldung(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {meldung ? (
          <Alert severity={meldung.schwere} onClose={() => setMeldung(null)} variant="filled">
            {meldung.text}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Stack>
  );
}

function Stammdatenblock({ pdfData }: { pdfData: ReturnType<typeof buildPdfData> }) {
  const { stammdaten } = pdfData.begutachtung;
  const zeilen: Array<[string, string]> = [
    ['Person', stammdaten.person.name || '–'],
    [
      'Geburtsdatum',
      stammdaten.person.geburtsdatum ? formatDate(stammdaten.person.geburtsdatum) : '–',
    ],
    ['Gutachter:in', stammdaten.gutachter.name || '–'],
    [
      'Termin',
      [
        stammdaten.termin.datum ? formatDate(stammdaten.termin.datum) : null,
        stammdaten.termin.ort || null,
      ]
        .filter(Boolean)
        .join(' · ') || '–',
    ],
    ['Pflegekasse', stammdaten.versicherung.traeger || '–'],
    ['Aktenzeichen', stammdaten.versicherung.aktenzeichen || '–'],
  ];
  return (
    <Grid container spacing={1} sx={{ mt: 0.5 }}>
      {zeilen.map(([label, wert]) => (
        <Grid key={label} size={{ xs: 12, sm: 6 }}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2">{wert}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}
