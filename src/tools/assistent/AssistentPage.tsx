import { useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { ModellSektion } from './components/ModellSektion';
import { SkillVerwaltung } from './components/SkillVerwaltung';
import { GeneratorPanel } from './components/GeneratorPanel';
import { MarkdownErgebnis } from './components/MarkdownErgebnis';
import { DruckAnsicht } from './components/DruckAnsicht';
import { useAssistentSkills } from './state/useAssistentSkills';
import { baueNachrichten } from './domain/skills';
import { DEFAULT_MODELL_ID } from './llm/modelle';
import { generiere, webgpuVerfuegbar } from './llm/webllmRuntime';
import type { LlmStatus } from './llm/webllmRuntime';
import { modellVorbereiten } from './llm/webllmRuntime';
import { downloadAlsDatei, kopiereInZwischenablage } from '../../shared/download';

const WEBGPU = webgpuVerfuegbar();

export function AssistentPage() {
  const skills = useAssistentSkills();
  const [modellId, setModellId] = useState(DEFAULT_MODELL_ID);
  const [status, setStatus] = useState<LlmStatus>({ phase: 'idle' });
  const [gewaehlteSkillId, setGewaehlteSkillId] = useState<string>(skills.presets[0]?.id ?? '');
  const [eingabe, setEingabe] = useState('');
  const [ausgabe, setAusgabe] = useState('');
  const [laeuft, setLaeuft] = useState(false);
  const [druckText, setDruckText] = useState('');
  const [meldung, setMeldung] = useState<{ schwere: 'success' | 'error'; text: string } | null>(
    null,
  );
  const abortRef = useRef<AbortController | null>(null);

  const modellBereit = status.phase === 'bereit' && status.modellId === modellId;
  const gewaehlterSkill = gewaehlteSkillId ? skills.finden(gewaehlteSkillId) : undefined;
  const kannGenerieren = WEBGPU && modellBereit && Boolean(gewaehlterSkill) && !laeuft;

  async function handleModellLaden() {
    try {
      await modellVorbereiten(modellId, setStatus);
    } catch {
      /* Fehler ist bereits über setStatus gemeldet */
    }
  }

  function handleModellChange(id: string) {
    setModellId(id);
    setStatus({ phase: 'idle' });
  }

  async function handleGenerieren() {
    if (!gewaehlterSkill) return;
    setLaeuft(true);
    setAusgabe('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const nachrichten = baueNachrichten(gewaehlterSkill, eingabe.trim());
      await generiere(
        modellId,
        nachrichten,
        { temperature: gewaehlterSkill.temperature, maxTokens: gewaehlterSkill.maxTokens },
        (_delta, vollText) => setAusgabe(vollText),
        controller.signal,
        setStatus,
      );
    } catch (e) {
      const text = e instanceof Error ? e.message : 'Unbekannter Fehler';
      setMeldung({ schwere: 'error', text: `Generierung fehlgeschlagen: ${text}` });
      setStatus({ phase: 'fehler', fehler: text });
    } finally {
      abortRef.current = null;
      setLaeuft(false);
    }
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  async function handleKopieren() {
    try {
      await kopiereInZwischenablage(ausgabe);
      setMeldung({ schwere: 'success', text: 'Text in die Zwischenablage kopiert.' });
    } catch {
      setMeldung({ schwere: 'error', text: 'Kopieren fehlgeschlagen.' });
    }
  }

  function handleHerunterladen() {
    const basis = (gewaehlterSkill?.name ?? 'text')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    downloadAlsDatei(ausgabe, `${basis || 'text'}.md`, 'text/markdown');
  }

  function handleDrucken() {
    setDruckText(ausgabe);
    // Im nächsten Frame drucken, damit die Druck-Ansicht den neuen Text gerendert hat.
    requestAnimationFrame(() => window.print());
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h1">Textassistent</Typography>
        <Typography color="text.secondary">
          Lokales Sprachmodell im Browser: aus gespeicherten „Skills" Markdown-Entwürfe erzeugen und
          als PDF drucken.
        </Typography>
      </Box>

      <Alert severity="info" icon={false}>
        <AlertTitle>Hinweis</AlertTitle>
        Das Modell läuft vollständig in deinem Browser über WebGPU. Die Modellgewichte (je nach Modell
        einige hundert MB bis ~2 GB) werden einmalig von HuggingFace geladen und zwischengespeichert;
        deine Eingaben und Ergebnisse verlassen den Browser nicht. Die Ausgabe ist ein <strong>Entwurf</strong> —
        bitte immer prüfen.
      </Alert>

      {!WEBGPU ? (
        <Alert severity="warning">
          Dieser Browser unterstützt <strong>WebGPU</strong> nicht. Bitte ein aktuelles Chrome/Edge
          (oder Safari 18+) verwenden. Bis dahin ist das Generieren deaktiviert.
        </Alert>
      ) : null}

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
          1. Modell
        </Typography>
        <ModellSektion
          modellId={modellId}
          onModellChange={handleModellChange}
          status={status}
          onLaden={handleModellLaden}
          webgpu={WEBGPU}
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
          2. Skill
        </Typography>
        <SkillVerwaltung
          gewaehlteId={gewaehlteSkillId || null}
          onGewaehlt={setGewaehlteSkillId}
          onMeldung={setMeldung}
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
          3. Generieren
        </Typography>
        <GeneratorPanel
          eingabe={eingabe}
          onEingabeChange={setEingabe}
          kannGenerieren={kannGenerieren}
          laeuft={laeuft}
          onGenerieren={handleGenerieren}
          onStop={handleStop}
        />
        {!modellBereit && WEBGPU ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Bitte zuerst oben ein Modell laden.
          </Typography>
        ) : null}
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
          4. Ergebnis
        </Typography>
        <MarkdownErgebnis
          ausgabe={ausgabe}
          onAusgabeChange={setAusgabe}
          laeuft={laeuft}
          onKopieren={handleKopieren}
          onHerunterladen={handleHerunterladen}
          onDrucken={handleDrucken}
        />
      </Paper>

      <Box>
        <Button component={RouterLink} to="/" variant="text">
          Zurück zum Hub
        </Button>
      </Box>

      <DruckAnsicht markdown={druckText} />

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
