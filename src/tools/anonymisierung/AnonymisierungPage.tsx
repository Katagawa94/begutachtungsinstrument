import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { DateiUpload } from './components/DateiUpload';
import { RegelTabelle } from './components/RegelTabelle';
import { MarkdownAnsicht } from './components/MarkdownAnsicht';
import { anwendenRegeln } from './domain/anonymisierung';
import type { Ersetzungsregel } from './domain/anonymisierung';
import { konvertiereZuMarkdown } from './markitdown/pyodideRuntime';
import type { RuntimeStatus } from './markitdown/pyodideRuntime';
import { downloadAlsDatei, kopiereInZwischenablage } from '../../shared/download';

function basisDateiname(name: string): string {
  const ohneEndung = name.replace(/\.[^.]+$/, '');
  const slug = ohneEndung
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'dokument';
}

export function AnonymisierungPage() {
  const [originalMd, setOriginalMd] = useState<string | null>(null);
  const [dateiname, setDateiname] = useState<string | null>(null);
  const [regeln, setRegeln] = useState<Ersetzungsregel[]>([]);
  const [status, setStatus] = useState<RuntimeStatus>({ phase: 'idle' });
  const [meldung, setMeldung] = useState<{ schwere: 'success' | 'error'; text: string } | null>(
    null,
  );

  const { ergebnis, anzahlProRegel, gesamtAnzahl } = useMemo(
    () => anwendenRegeln(originalMd ?? '', regeln),
    [originalMd, regeln],
  );

  async function handleDatei(file: File) {
    try {
      const md = await konvertiereZuMarkdown(file, setStatus);
      setOriginalMd(md);
      setDateiname(file.name);
      setStatus({ phase: 'bereit' });
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Unbekannter Fehler';
      setStatus({ phase: 'fehler', fehler: text });
    }
  }

  async function handleKopieren() {
    try {
      await kopiereInZwischenablage(ergebnis);
      setMeldung({ schwere: 'success', text: 'Anonymisierter Text in die Zwischenablage kopiert.' });
    } catch {
      setMeldung({ schwere: 'error', text: 'Kopieren fehlgeschlagen — Browser hat den Zugriff abgelehnt.' });
    }
  }

  function handleHerunterladen() {
    const name = `${basisDateiname(dateiname ?? 'dokument')}-anonymisiert.md`;
    downloadAlsDatei(ergebnis, name, 'text/markdown');
    setMeldung({ schwere: 'success', text: `Gespeichert als ${name}.` });
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Anonymisierung</Typography>
        <Typography color="text.secondary">
          Dateien lokal nach Markdown konvertieren und vor der Weitergabe an eine KI anonymisieren.
        </Typography>
      </Box>

      <Alert severity="info" icon={false}>
        <AlertTitle>Hinweis zum Datenschutz</AlertTitle>
        Die Konvertierung läuft vollständig in deinem Browser (über MarkItDown via Pyodide). Die
        hochgeladene Datei verlässt den Browser nicht — lediglich die Python-Laufzeit wird einmalig
        von einem öffentlichen CDN geladen. Nichts (auch nicht die Ersetzungsregeln, die ja
        Klarnamen enthalten) wird gespeichert; beim Schließen des Tabs ist alles weg.
      </Alert>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
          1. Datei laden
        </Typography>
        <DateiUpload status={status} dateiname={dateiname} onDatei={handleDatei} />
      </Paper>

      {originalMd !== null ? (
        <>
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
              2. Ersetzungen festlegen
            </Typography>
            <RegelTabelle
              regeln={regeln}
              anzahlProRegel={anzahlProRegel}
              onChange={setRegeln}
            />
          </Paper>

          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
              3. Ergebnis
            </Typography>
            <MarkdownAnsicht
              original={originalMd}
              anonymisiert={ergebnis}
              gesamtAnzahl={gesamtAnzahl}
              onKopieren={handleKopieren}
              onHerunterladen={handleHerunterladen}
            />
          </Paper>
        </>
      ) : (
        <Alert severity="info" variant="outlined">
          Lade eine Datei, um sie zu konvertieren und zu anonymisieren.
        </Alert>
      )}

      <Box>
        <Button component={RouterLink} to="/" variant="text">
          Zurück zum Hub
        </Button>
      </Box>

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
