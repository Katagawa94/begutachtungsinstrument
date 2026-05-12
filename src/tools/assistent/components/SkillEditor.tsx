import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Skill, SkillBeispiel } from '../domain/skills';

const MAX_TOKENS_OPTIONEN = [256, 512, 1024, 2048];

type Props = {
  offen: boolean;
  skill: Skill | null;
  onSpeichern: (skill: Skill) => void;
  onAbbrechen: () => void;
};

export function SkillEditor({ offen, skill, onSpeichern, onAbbrechen }: Props) {
  const [draft, setDraft] = useState<Skill | null>(skill);

  useEffect(() => {
    setDraft(skill);
  }, [skill]);

  if (!draft) return null;

  function setze<K extends keyof Skill>(feld: K, wert: Skill[K]) {
    setDraft((d) => (d ? { ...d, [feld]: wert } : d));
  }
  function setzeBeispiel(index: number, patch: Partial<SkillBeispiel>) {
    setDraft((d) =>
      d ? { ...d, beispiele: d.beispiele.map((b, i) => (i === index ? { ...b, ...patch } : b)) } : d,
    );
  }
  function beispielHinzufuegen() {
    setDraft((d) => (d ? { ...d, beispiele: [...d.beispiele, { eingabe: '', ausgabe: '' }] } : d));
  }
  function beispielEntfernen(index: number) {
    setDraft((d) => (d ? { ...d, beispiele: d.beispiele.filter((_, i) => i !== index) } : d));
  }

  const speicherbar = draft.name.trim().length > 0 && draft.systemPrompt.trim().length > 0;

  return (
    <Dialog open={offen} onClose={onAbbrechen} fullWidth maxWidth="md">
      <DialogTitle>Skill bearbeiten</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Name"
            value={draft.name}
            onChange={(e) => setze('name', e.target.value)}
            fullWidth
            size="small"
            autoComplete="off"
            required
          />
          <TextField
            label="Kurzbeschreibung"
            value={draft.beschreibung}
            onChange={(e) => setze('beschreibung', e.target.value)}
            fullWidth
            size="small"
            autoComplete="off"
          />
          <TextField
            label="System-Prompt (Anweisungen für das Modell)"
            value={draft.systemPrompt}
            onChange={(e) => setze('systemPrompt', e.target.value)}
            fullWidth
            multiline
            minRows={4}
            maxRows={12}
            required
            helperText="Was soll das Modell tun? Welche Struktur soll der Markdown-Output haben?"
          />
          <TextField
            label="Markdown-Vorlage (optional)"
            value={draft.vorlage}
            onChange={(e) => setze('vorlage', e.target.value)}
            fullWidth
            multiline
            minRows={3}
            maxRows={10}
            helperText="Wenn gesetzt, wird sie dem Modell als Gerüst mitgegeben."
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Beispiele (optional, few-shot)
            </Typography>
            <Stack spacing={1.5}>
              {draft.beispiele.map((b, i) => (
                <Stack key={i} direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="flex-start">
                  <TextField
                    label={`Beispiel-Eingabe #${i + 1}`}
                    value={b.eingabe}
                    onChange={(e) => setzeBeispiel(i, { eingabe: e.target.value })}
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                  />
                  <TextField
                    label="Beispiel-Ausgabe (Markdown)"
                    value={b.ausgabe}
                    onChange={(e) => setzeBeispiel(i, { ausgabe: e.target.value })}
                    fullWidth
                    multiline
                    minRows={2}
                    size="small"
                  />
                  <IconButton
                    aria-label={`Beispiel ${i + 1} entfernen`}
                    onClick={() => beispielEntfernen(i)}
                    size="small"
                    sx={{ mt: 0.5 }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              ))}
              <Box>
                <Button size="small" startIcon={<AddIcon />} onClick={beispielHinzufuegen}>
                  Beispiel hinzufügen
                </Button>
              </Box>
            </Stack>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ sm: 'center' }}>
            <Box sx={{ minWidth: 220 }}>
              <Typography variant="caption" color="text.secondary">
                Temperatur: {draft.temperature.toFixed(2)} (niedrig = nüchtern, hoch = kreativer)
              </Typography>
              <Slider
                value={draft.temperature}
                min={0}
                max={1.5}
                step={0.05}
                onChange={(_e, v) => setze('temperature', Array.isArray(v) ? v[0]! : v)}
                size="small"
              />
            </Box>
            <TextField
              select
              label="Max. Antwortlänge"
              value={draft.maxTokens}
              onChange={(e) => setze('maxTokens', Number(e.target.value))}
              size="small"
              sx={{ minWidth: 160 }}
            >
              {MAX_TOKENS_OPTIONEN.map((t) => (
                <MenuItem key={t} value={t}>
                  {t} Tokens
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onAbbrechen}>Abbrechen</Button>
        <Button variant="contained" onClick={() => onSpeichern(draft)} disabled={!speicherbar}>
          Speichern
        </Button>
      </DialogActions>
    </Dialog>
  );
}
