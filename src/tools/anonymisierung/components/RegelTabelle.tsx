import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Ersetzungsregel } from '../domain/anonymisierung';
import { neueRegel } from '../domain/anonymisierung';

type Props = {
  regeln: Ersetzungsregel[];
  anzahlProRegel: Record<string, number>;
  onChange: (regeln: Ersetzungsregel[]) => void;
};

export function RegelTabelle({ regeln, anzahlProRegel, onChange }: Props) {
  function aktualisiere(id: string, patch: Partial<Ersetzungsregel>) {
    onChange(regeln.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function entferne(id: string) {
    onChange(regeln.filter((r) => r.id !== id));
  }
  function hinzufuegen() {
    onChange([...regeln, neueRegel()]);
  }

  return (
    <Stack spacing={1.5}>
      {regeln.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Noch keine Ersetzungsregeln. Füge eine hinzu, um Wörter im Text zu ersetzen.
        </Typography>
      ) : null}

      {regeln.map((regel, index) => {
        const treffer = anzahlProRegel[regel.id] ?? 0;
        return (
          <Paper key={regel.id} variant="outlined" sx={{ p: 1.5 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'stretch', md: 'center' }}
            >
              <TextField
                label={`Suchen #${index + 1}`}
                size="small"
                fullWidth
                value={regel.suchen}
                onChange={(e) => aktualisiere(regel.id, { suchen: e.target.value })}
                autoComplete="off"
                sx={{ flex: 1 }}
              />
              <TextField
                label="Ersetzen durch"
                size="small"
                fullWidth
                value={regel.ersetzen}
                onChange={(e) => aktualisiere(regel.id, { ersetzen: e.target.value })}
                autoComplete="off"
                sx={{ flex: 1 }}
              />
              <Stack direction="row" spacing={0} alignItems="center" flexWrap="wrap">
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={regel.caseSensitive}
                      onChange={(e) => aktualisiere(regel.id, { caseSensitive: e.target.checked })}
                    />
                  }
                  label={<Typography variant="caption">Groß-/Kleinschreibung</Typography>}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={regel.teilwort}
                      onChange={(e) => aktualisiere(regel.id, { teilwort: e.target.checked })}
                    />
                  }
                  label={<Typography variant="caption">Teilwort</Typography>}
                />
              </Stack>
              <Tooltip title="Anzahl der Ersetzungen im aktuellen Text">
                <Chip
                  size="small"
                  color={treffer > 0 ? 'primary' : 'default'}
                  label={`${treffer} ${treffer === 1 ? 'Ersetzung' : 'Ersetzungen'}`}
                  sx={{ minWidth: 110 }}
                />
              </Tooltip>
              <Tooltip title="Regel entfernen">
                <IconButton
                  aria-label={`Regel ${index + 1} entfernen`}
                  onClick={() => entferne(regel.id)}
                  size="small"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Paper>
        );
      })}

      <Box>
        <Button startIcon={<AddIcon />} onClick={hinzufuegen} variant="outlined" size="small">
          Regel hinzufügen
        </Button>
      </Box>
    </Stack>
  );
}
