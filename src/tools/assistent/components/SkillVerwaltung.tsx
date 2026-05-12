import { useRef, useState } from 'react';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ListSubheader from '@mui/material/ListSubheader';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import { useAssistentSkills } from '../state/useAssistentSkills';
import { SkillEditor } from './SkillEditor';
import { exportiereAlsJson, parseImport } from '../state/storage';
import { downloadAlsDatei, leseDateiAlsText } from '../../../shared/download';
import type { Skill } from '../domain/skills';

type Props = {
  gewaehlteId: string | null;
  onGewaehlt: (id: string) => void;
  onMeldung: (m: { schwere: 'success' | 'error'; text: string }) => void;
};

export function SkillVerwaltung({ gewaehlteId, onGewaehlt, onMeldung }: Props) {
  const skills = useAssistentSkills();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [editorSkill, setEditorSkill] = useState<Skill | null>(null);

  const gewaehlt = gewaehlteId ? skills.finden(gewaehlteId) : undefined;
  const istPresetGewaehlt = gewaehlteId ? skills.istPreset(gewaehlteId) : false;

  function handleNeu() {
    const neu = skills.erstellen();
    onGewaehlt(neu.id);
    setEditorSkill(neu);
  }
  function handleBearbeiten() {
    if (!gewaehlt) return;
    if (istPresetGewaehlt) {
      // Presets sind schreibgeschützt → editierbare Kopie anlegen
      const kopie = skills.duplizieren(gewaehlt.id);
      if (kopie) {
        onGewaehlt(kopie.id);
        setEditorSkill(kopie);
      }
      return;
    }
    setEditorSkill(gewaehlt);
  }
  function handleDuplizieren() {
    if (!gewaehlt) return;
    const kopie = skills.duplizieren(gewaehlt.id);
    if (kopie) {
      onGewaehlt(kopie.id);
      onMeldung({ schwere: 'success', text: 'Skill dupliziert.' });
    }
  }
  function handleLoeschen() {
    if (!gewaehlt || istPresetGewaehlt) return;
    skills.loeschen(gewaehlt.id);
    const ersatz = skills.alleSkills.find((s) => s.id !== gewaehlt.id);
    onGewaehlt(ersatz ? ersatz.id : '');
    onMeldung({ schwere: 'success', text: 'Skill gelöscht.' });
  }
  function handleExport() {
    if (skills.eigeneSkills.length === 0) {
      onMeldung({ schwere: 'error', text: 'Keine eigenen Skills zum Exportieren.' });
      return;
    }
    const heute = new Date().toISOString().slice(0, 10);
    downloadAlsDatei(exportiereAlsJson(skills.eigeneSkills), `assistent-skills-${heute}.json`);
  }
  async function handleImport(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const text = await leseDateiAlsText(file);
      const ergebnis = parseImport(text);
      if (!ergebnis.ok) {
        onMeldung({ schwere: 'error', text: `Import fehlgeschlagen: ${ergebnis.fehler}` });
        return;
      }
      skills.importieren(ergebnis.skills, 'ergaenzen');
      onMeldung({ schwere: 'success', text: `${ergebnis.skills.length} Skill(s) importiert.` });
    } catch (e) {
      onMeldung({ schwere: 'error', text: `Import fehlgeschlagen: ${e instanceof Error ? e.message : 'Fehler'}` });
    }
  }
  function handleSpeichern(skill: Skill) {
    skills.aktualisieren(skill);
    setEditorSkill(null);
    onMeldung({ schwere: 'success', text: 'Skill gespeichert.' });
  }

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        <TextField
          select
          label="Skill"
          value={gewaehlteId ?? ''}
          onChange={(e) => onGewaehlt(e.target.value)}
          size="small"
          sx={{ minWidth: 260 }}
        >
          <ListSubheader>Vorlagen</ListSubheader>
          {skills.presets.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
          {skills.eigeneSkills.length > 0 ? <ListSubheader>Eigene Skills</ListSubheader> : null}
          {skills.eigeneSkills.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Button size="small" startIcon={<AddIcon />} onClick={handleNeu}>
            Neu
          </Button>
          <Button size="small" startIcon={<EditIcon />} onClick={handleBearbeiten} disabled={!gewaehlt}>
            {istPresetGewaehlt ? 'Als Kopie bearbeiten' : 'Bearbeiten'}
          </Button>
          <Button size="small" startIcon={<ContentCopyIcon />} onClick={handleDuplizieren} disabled={!gewaehlt}>
            Duplizieren
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleLoeschen}
            disabled={!gewaehlt || istPresetGewaehlt}
          >
            Löschen
          </Button>
          <Button size="small" startIcon={<UploadIcon />} onClick={() => fileInputRef.current?.click()}>
            Importieren
          </Button>
          <Button size="small" startIcon={<DownloadIcon />} onClick={handleExport}>
            Exportieren
          </Button>
          <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={handleImport} />
        </Stack>
      </Stack>

      {gewaehlt ? (
        <Typography variant="caption" color="text.secondary">
          {istPresetGewaehlt ? 'Vorlage (schreibgeschützt) · ' : ''}
          {gewaehlt.beschreibung || 'Keine Beschreibung.'}
        </Typography>
      ) : (
        <Typography variant="caption" color="text.secondary">
          Wähle einen Skill aus oder lege einen neuen an.
        </Typography>
      )}

      <SkillEditor
        offen={editorSkill !== null}
        skill={editorSkill}
        onSpeichern={handleSpeichern}
        onAbbrechen={() => setEditorSkill(null)}
      />
    </Stack>
  );
}
