import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';

type Props = {
  eingabe: string;
  onEingabeChange: (text: string) => void;
  kannGenerieren: boolean;
  laeuft: boolean;
  onGenerieren: () => void;
  onStop: () => void;
};

export function GeneratorPanel({
  eingabe,
  onEingabeChange,
  kannGenerieren,
  laeuft,
  onGenerieren,
  onStop,
}: Props) {
  return (
    <Stack spacing={1.5}>
      <TextField
        label="Eingabe / Stichpunkte / Kontext"
        value={eingabe}
        onChange={(e) => onEingabeChange(e.target.value)}
        multiline
        minRows={4}
        maxRows={16}
        fullWidth
        placeholder="z. B. Stichpunkte zum Sachverhalt, die das Modell ausformulieren soll …"
      />
      <Stack direction="row" spacing={1.5}>
        <Button
          variant="contained"
          startIcon={laeuft ? <CircularProgress size={18} color="inherit" /> : <PlayArrowIcon />}
          onClick={onGenerieren}
          disabled={!kannGenerieren || laeuft || eingabe.trim().length === 0}
        >
          {laeuft ? 'Generiert …' : 'Generieren'}
        </Button>
        {laeuft ? (
          <Button variant="outlined" color="error" startIcon={<StopIcon />} onClick={onStop}>
            Stop
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
