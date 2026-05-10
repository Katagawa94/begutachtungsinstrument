import { useId } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import type { Bewertung, Kriterium } from '../domain/types';

type Props = {
  kriterium: Kriterium;
  bewertung: Bewertung | undefined;
  onChange: (next: Partial<Bewertung>) => void;
};

export function KriteriumCard({ kriterium, bewertung, onChange }: Props) {
  const labelId = useId();
  const wert = bewertung?.wert ?? null;
  const kommentar = bewertung?.kommentar ?? '';

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
              {kriterium.id}
            </Typography>
            <Typography id={labelId} variant="subtitle1" sx={{ fontWeight: 500 }}>
              {kriterium.bezeichnung}
            </Typography>
            {kriterium.faktor && kriterium.faktor !== 1 ? (
              <Tooltip title={`Punkte werden mit Faktor ${kriterium.faktor} multipliziert`}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 'auto', flexShrink: 0 }}
                >
                  ×{kriterium.faktor}
                </Typography>
              </Tooltip>
            ) : null}
          </Box>

          {kriterium.skala.art === 'ordinal' ? (
            <OrdinalAuswahl
              labelId={labelId}
              wert={wert}
              stufen={kriterium.skala.stufen}
              onChange={(v) => onChange({ wert: v })}
            />
          ) : (
            <FrequenzEingabe
              labelId={labelId}
              wert={wert}
              max={kriterium.skala.max}
              hinweis={kriterium.skala.hinweis}
              onChange={(v) => onChange({ wert: v })}
            />
          )}

          <TextField
            label="Kommentar"
            value={kommentar}
            onChange={(e) => onChange({ kommentar: e.target.value })}
            multiline
            minRows={1}
            maxRows={6}
            fullWidth
            size="small"
            placeholder="Optionale Anmerkung zur Begründung der Einschätzung"
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function OrdinalAuswahl({
  labelId,
  wert,
  stufen,
  onChange,
}: {
  labelId: string;
  wert: number | null;
  stufen: { wert: number; label: string; hinweis?: string }[];
  onChange: (wert: number | null) => void;
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      <ToggleButtonGroup
        aria-labelledby={labelId}
        value={wert}
        exclusive
        size="small"
        onChange={(_event, neu) => onChange(neu)}
      >
        {stufen.map((stufe) => (
          <ToggleButton key={stufe.wert} value={stufe.wert} sx={{ px: 2 }}>
            <Stack alignItems="center" spacing={0} sx={{ lineHeight: 1.1 }}>
              <Typography variant="body2" component="span" sx={{ fontWeight: 600 }}>
                {stufe.wert}
              </Typography>
              <Typography
                variant="caption"
                component="span"
                sx={{ textTransform: 'none', whiteSpace: 'normal', textAlign: 'center' }}
              >
                {stufe.label}
              </Typography>
              {stufe.hinweis ? (
                <Typography
                  variant="caption"
                  component="span"
                  color="text.secondary"
                  sx={{ textTransform: 'none', fontSize: 11 }}
                >
                  ({stufe.hinweis})
                </Typography>
              ) : null}
            </Stack>
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {wert !== null ? (
        <Tooltip title="Bewertung zurücksetzen">
          <IconButton size="small" aria-label="Bewertung zurücksetzen" onClick={() => onChange(null)}>
            <ClearIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Stack>
  );
}

function FrequenzEingabe({
  labelId,
  wert,
  max,
  hinweis,
  onChange,
}: {
  labelId: string;
  wert: number | null;
  max: number;
  hinweis: string;
  onChange: (wert: number | null) => void;
}) {
  return (
    <Stack spacing={1}>
      <TextField
        type="number"
        size="small"
        slotProps={{
          input: { inputProps: { min: 0, max, step: 1, 'aria-labelledby': labelId } },
        }}
        sx={{ maxWidth: 200 }}
        value={wert ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === '') {
            onChange(null);
            return;
          }
          const zahl = Number(raw);
          if (Number.isNaN(zahl)) return;
          const begrenzt = Math.max(0, Math.min(max, Math.round(zahl)));
          onChange(begrenzt);
        }}
        helperText={`Punktwert (0–${max})`}
        label="Einzelpunkte"
      />
      <Typography variant="caption" color="text.secondary">
        {hinweis}
      </Typography>
    </Stack>
  );
}
