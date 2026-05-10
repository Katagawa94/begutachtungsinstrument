import { useId, useMemo } from 'react';
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
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ClearIcon from '@mui/icons-material/Clear';
import type {
  Bewertung,
  Kriterium,
  Modul5Berechnung,
  Modul5Frequenz,
  SkalenStufe,
} from '../domain/types';
import { berechneModul5Punkte, istLeere } from '../domain/modul5Berechnung';

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
            <Modul5Kalkulator
              labelId={labelId}
              max={kriterium.skala.max}
              hinweis={kriterium.skala.hinweis}
              berechnung={kriterium.skala.berechnung}
              frequenz={bewertung?.frequenz}
              wert={wert}
              onChange={(naechsteFrequenz) => {
                if (naechsteFrequenz === null) {
                  onChange({ wert: null, frequenz: undefined });
                  return;
                }
                const punkte = berechneModul5Punkte(
                  kriterium.skala.art === 'frequenz'
                    ? kriterium.skala.berechnung
                    : { art: 'tagWocheMonat', faktor: 1 },
                  kriterium.skala.art === 'frequenz' ? kriterium.skala.max : 0,
                  naechsteFrequenz,
                );
                onChange({ wert: punkte, frequenz: naechsteFrequenz });
              }}
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

type KalkulatorProps = {
  labelId: string;
  max: number;
  hinweis: string;
  berechnung: Modul5Berechnung;
  frequenz: Modul5Frequenz | undefined;
  wert: number | null;
  onChange: (naechste: Modul5Frequenz | null) => void;
};

function Modul5Kalkulator({
  labelId,
  max,
  hinweis,
  berechnung,
  frequenz,
  wert,
  onChange,
}: KalkulatorProps) {
  const eingabeLeer = istLeere(frequenz);
  const punkteLabel = useMemo(() => {
    if (eingabeLeer || wert === null) return 'nicht bewertet';
    const einheit = wert === 1 ? 'Punkt' : 'Punkte';
    return `${wert} ${einheit}`;
  }, [eingabeLeer, wert]);

  function setze(patch: Partial<Modul5Frequenz>) {
    const naechste: Modul5Frequenz = { ...(frequenz ?? {}), ...patch };
    if (istLeere(naechste)) {
      onChange(null);
      return;
    }
    onChange(naechste);
  }

  return (
    <Stack spacing={1.5} aria-labelledby={labelId}>
      {berechnung.art === 'jaNein' ? (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(frequenz?.jaNein)}
              onChange={(_e, checked) => onChange(checked ? { jaNein: true } : null)}
            />
          }
          label="Erforderlich"
        />
      ) : berechnung.art === 'monatlich' ? (
        <ZahlEingabe
          label="Pro Monat"
          value={frequenz?.monat}
          max={300}
          onChange={(monat) => setze({ monat })}
        />
      ) : (
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          <ZahlEingabe
            label="Pro Tag"
            value={frequenz?.tag}
            max={50}
            onChange={(tag) => setze({ tag })}
          />
          <ZahlEingabe
            label="Pro Woche"
            value={frequenz?.woche}
            max={50}
            onChange={(woche) => setze({ woche })}
          />
          <ZahlEingabe
            label="Pro Monat"
            value={frequenz?.monat}
            max={300}
            onChange={(monat) => setze({ monat })}
          />
        </Stack>
      )}

      <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap flexWrap="wrap">
        <Box
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: 1,
            bgcolor: eingabeLeer ? 'action.hover' : 'primary.main',
            color: eingabeLeer ? 'text.secondary' : 'primary.contrastText',
            fontWeight: 600,
            fontSize: 14,
            transition: 'background-color 150ms ease, color 150ms ease',
          }}
        >
          {punkteLabel}
          {!eingabeLeer && wert !== null && wert >= max ? (
            <Typography component="span" variant="caption" sx={{ ml: 0.75, opacity: 0.85 }}>
              (max)
            </Typography>
          ) : null}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
          {hinweis}
        </Typography>
        {!eingabeLeer ? (
          <Tooltip title="Eingabe zurücksetzen">
            <IconButton
              size="small"
              aria-label="Eingabe zurücksetzen"
              onClick={() => onChange(null)}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : null}
      </Stack>
    </Stack>
  );
}

function ZahlEingabe({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number | undefined;
  max: number;
  onChange: (wert: number | undefined) => void;
}) {
  return (
    <TextField
      type="number"
      label={label}
      size="small"
      sx={{ width: 130 }}
      slotProps={{ input: { inputProps: { min: 0, max, step: 1 } } }}
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === '') {
          onChange(undefined);
          return;
        }
        const zahl = Number(raw);
        if (Number.isNaN(zahl)) return;
        const begrenzt = Math.max(0, Math.min(max, Math.round(zahl)));
        onChange(begrenzt);
      }}
    />
  );
}
