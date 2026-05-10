import { useMemo, useRef, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { downloadBegutachtungPdf } from '../pdf/download';
import { useBegutachtungen } from '../state/useBegutachtungen';
import {
  exportiereAlleAlsJson,
  exportiereAlsJson,
  parseImport,
} from '../state/storage';
import { berechneFortschritt, berechneGesamtergebnis } from '../domain/scoring';
import { bezeichnungFuer, downloadDateinameFuer, formatDateTime } from '../utils/format';
import { downloadAlsDatei, leseDateiAlsText } from '../utils/download';

export function UebersichtPage() {
  const { begutachtungen, erstellen, erstelleBeispiel, loeschen, duplizieren, importieren } =
    useBegutachtungen();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [zuLoeschen, setZuLoeschen] = useState<string | null>(null);
  const [meldung, setMeldung] = useState<{ schwere: 'success' | 'error'; text: string } | null>(
    null,
  );

  const sortiert = useMemo(
    () =>
      [...begutachtungen].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
    [begutachtungen],
  );

  function handleNeu() {
    const id = erstellen();
    navigate(`/begutachtung/${id}/stammdaten`);
  }

  function handleBeispiel() {
    const id = erstelleBeispiel();
    navigate(`/begutachtung/${id}/abschluss`);
  }

  function handleLoeschenBestaetigen() {
    if (!zuLoeschen) return;
    loeschen(zuLoeschen);
    setZuLoeschen(null);
    setMeldung({ schwere: 'success', text: 'Begutachtung gelöscht.' });
  }

  function handleDuplizieren(id: string) {
    const neueId = duplizieren(id);
    if (neueId) {
      setMeldung({ schwere: 'success', text: 'Begutachtung dupliziert.' });
    }
  }

  function handleExportEinzeln(id: string) {
    const b = begutachtungen.find((x) => x.id === id);
    if (!b) return;
    downloadAlsDatei(exportiereAlsJson(b), downloadDateinameFuer(b));
  }

  async function handlePdfEinzeln(id: string) {
    const b = begutachtungen.find((x) => x.id === id);
    if (!b) return;
    try {
      await downloadBegutachtungPdf(b);
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Unbekannter Fehler';
      setMeldung({ schwere: 'error', text: `PDF-Erstellung fehlgeschlagen: ${text}` });
    }
  }

  function handleExportAlle() {
    if (begutachtungen.length === 0) return;
    const heute = new Date().toISOString().slice(0, 10);
    downloadAlsDatei(exportiereAlleAlsJson(begutachtungen), `begutachtungen-${heute}.json`);
  }

  async function handleImportDatei(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await leseDateiAlsText(file);
      const ergebnis = parseImport(text);
      if (!ergebnis.ok) {
        setMeldung({ schwere: 'error', text: `Import fehlgeschlagen: ${ergebnis.fehler}` });
        return;
      }
      importieren(ergebnis.begutachtungen, 'ergaenzen');
      setMeldung({
        schwere: 'success',
        text: `${ergebnis.begutachtungen.length} Begutachtung(en) importiert.`,
      });
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Unbekannter Fehler';
      setMeldung({ schwere: 'error', text: `Import fehlgeschlagen: ${text}` });
    }
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h1">Begutachtungen</Typography>
          <Typography color="text.secondary">
            Alle Daten werden lokal in deinem Browser gespeichert.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Tooltip title="Erzeugt eine vollständig ausgefüllte Beispiel-Begutachtung (PG 3) zum Ausprobieren.">
            <Button variant="outlined" startIcon={<AutoAwesomeIcon />} onClick={handleBeispiel}>
              Beispiel laden
            </Button>
          </Tooltip>
          <Button variant="outlined" startIcon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>
            Importieren
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExportAlle}
            disabled={begutachtungen.length === 0}
          >
            Alle exportieren
          </Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleNeu}>
            Neue Begutachtung
          </Button>
        </Stack>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleImportDatei}
        />
      </Stack>

      {sortiert.length === 0 ? (
        <Alert severity="info">
          Noch keine Begutachtungen vorhanden. Lege eine neue an oder importiere eine JSON-Datei.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {sortiert.map((b) => {
            const fortschritt = berechneFortschritt(b.bewertungen);
            const ergebnis = berechneGesamtergebnis(b.bewertungen);
            return (
              <Card key={b.id} variant="outlined">
                <CardContent>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    alignItems={{ sm: 'center' }}
                    sx={{ mb: 1 }}
                  >
                    <Typography variant="h3" component="h2" sx={{ flexGrow: 1 }}>
                      {bezeichnungFuer(b)}
                    </Typography>
                    <Chip
                      size="small"
                      color={ergebnis.pflegegrad > 0 ? 'primary' : 'default'}
                      label={
                        ergebnis.pflegegrad > 0
                          ? `PG ${ergebnis.pflegegrad} · ${ergebnis.gesamtpunkte} P.`
                          : 'kein PG bisher'
                      }
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    Zuletzt bearbeitet {formatDateTime(b.updatedAt)} · {fortschritt.bewertet}/
                    {fortschritt.gesamt} Kriterien bewertet
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <LinearProgress variant="determinate" value={fortschritt.prozent} />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    component={RouterLink}
                    to={`/begutachtung/${b.id}/stammdaten`}
                    startIcon={<EditIcon />}
                  >
                    Bearbeiten
                  </Button>
                  <Tooltip title="Als PDF herunterladen">
                    <IconButton aria-label="PDF" onClick={() => handlePdfEinzeln(b.id)}>
                      <PictureAsPdfIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Als JSON exportieren">
                    <IconButton aria-label="exportieren" onClick={() => handleExportEinzeln(b.id)}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Duplizieren">
                    <IconButton aria-label="duplizieren" onClick={() => handleDuplizieren(b.id)}>
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Löschen">
                    <IconButton aria-label="löschen" onClick={() => setZuLoeschen(b.id)}>
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            );
          })}
        </Stack>
      )}

      <Dialog open={zuLoeschen !== null} onClose={() => setZuLoeschen(null)}>
        <DialogTitle>Begutachtung löschen?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Diese Aktion kann nicht rückgängig gemacht werden. Erwäge vorher einen JSON-Export.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setZuLoeschen(null)}>Abbrechen</Button>
          <Button color="error" variant="contained" onClick={handleLoeschenBestaetigen}>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>

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
