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
import type { Bewertung, Kriterium, SkalenStufe } from '../domain/types';

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
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
              {kriterium.id}
            </Typography>
            <Typography id={labelId} variant="subtitle1" sx={{ fontWeight: 500, flexGrow: 1 }}>
              {kriterium.bezeichnung}
            </Typography>
            {kriterium.faktor && kriterium.faktor !== 1 ? (
              <Tooltip title={`Punkte werden mit Faktor ${kriterium.faktor} multipliziert`}>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                  ×{kriterium.faktor}
                </Typography>
              </Tooltip>
            ) : null}
          </Box>

          {kriterium.beschreibung ? (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {kriterium.beschreibung}
            </Typography>
          ) : null}

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
  stufen: SkalenStufe[];
  onChange: (wert: number | null) => void;
}) {
  const ausgewaehlteStufe = stufen.find((s) => s.wert === wert) ?? null;
  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      flexWrap="wrap"
      useFlexGap
      sx={{ rowGap: 1 }}
    >
      <ToggleButtonGroup
        aria-labelledby={labelId}
        value={wert}
        exclusive
        size="small"
        onChange={(_event, neu) => onChange(neu)}
      >
        {stufen.map((stufe) => (
          <Tooltip
            key={stufe.wert}
            title={stufe.hinweis ? `${stufe.label} (${stufe.hinweis})` : stufe.label}
            placement="top"
          >
            <ToggleButton value={stufe.wert} sx={{ minWidth: 40, px: 1.5, fontWeight: 600 }}>
              {stufe.wert}
            </ToggleButton>
          </Tooltip>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {ausgewaehlteStufe ? (
          <Stack direction="row" spacing={0.5} alignItems="baseline" sx={{ flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {ausgewaehlteStufe.wert} —
            </Typography>
            <Typography variant="body2">{ausgewaehlteStufe.label}</Typography>
            {ausgewaehlteStufe.hinweis ? (
              <Typography variant="caption" color="text.secondary">
                ({ausgewaehlteStufe.hinweis})
              </Typography>
            ) : null}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            nicht bewertet
          </Typography>
        )}
      </Box>

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
      <Stack direction="row" spacing={2} alignItems="center" useFlexGap>
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
        <Typography
          variant="body2"
          color={wert === null ? 'text.secondary' : 'text.primary'}
          sx={{ fontStyle: wert === null ? 'italic' : 'normal' }}
        >
          {wert === null ? 'nicht bewertet' : `${wert} Punkte`}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary">
        {hinweis}
      </Typography>
    </Stack>
  );
}
