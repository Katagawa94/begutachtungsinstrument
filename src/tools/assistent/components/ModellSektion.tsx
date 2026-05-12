import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { MODELLE, modellLabel } from '../llm/modelle';
import type { LlmStatus } from '../llm/webllmRuntime';

type Props = {
  modellId: string;
  onModellChange: (id: string) => void;
  status: LlmStatus;
  onLaden: () => void;
  webgpu: boolean;
};

export function ModellSektion({ modellId, onModellChange, status, onLaden, webgpu }: Props) {
  const laedt = status.phase === 'laden';
  const bereit = status.phase === 'bereit' && status.modellId === modellId;

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <TextField
          select
          label="Modell"
          value={modellId}
          onChange={(e) => onModellChange(e.target.value)}
          size="small"
          disabled={laedt}
          sx={{ minWidth: 240 }}
        >
          {MODELLE.map((m) => (
            <MenuItem key={m.id} value={m.id}>
              {m.label} · ca. {m.groesseMb >= 1000 ? `${(m.groesseMb / 1000).toFixed(1)} GB` : `${m.groesseMb} MB`}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={onLaden}
          disabled={!webgpu || laedt || bereit}
        >
          {bereit ? 'Modell geladen' : laedt ? 'Lädt …' : 'Modell laden'}
        </Button>
        {bereit ? (
          <Chip
            icon={<CheckCircleOutlineIcon />}
            color="success"
            variant="outlined"
            label={`${modellLabel(modellId)} bereit`}
            size="small"
          />
        ) : null}
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {MODELLE.find((m) => m.id === modellId)?.beschreibung}
      </Typography>

      {laedt ? (
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {status.text}
            {typeof status.fortschritt === 'number'
              ? ` · ${Math.round(status.fortschritt * 100)} %`
              : ''}
          </Typography>
          <LinearProgress
            variant={typeof status.fortschritt === 'number' ? 'determinate' : 'indeterminate'}
            value={typeof status.fortschritt === 'number' ? status.fortschritt * 100 : undefined}
          />
        </Box>
      ) : null}

      {status.phase === 'fehler' ? <Alert severity="error">{status.fehler}</Alert> : null}
    </Stack>
  );
}
