import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import type { Step } from '../navigation';
import { berechneFortschritt, berechneModulFortschritt } from '../domain/scoring';
import type { Bewertungen } from '../domain/types';

type Props = {
  steps: Step[];
  activeIndex: number;
  bewertungen: Bewertungen;
  stammdatenVollstaendig: boolean;
};

export function FortschrittStepper({
  steps,
  activeIndex,
  bewertungen,
  stammdatenVollstaendig,
}: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const fortschritt = berechneFortschritt(bewertungen);

  function istErledigt(step: Step): boolean {
    if (step.kind === 'stammdaten') return stammdatenVollstaendig;
    if (step.kind === 'modul') return berechneModulFortschritt(step.modulId, bewertungen).vollstaendig;
    return false;
  }

  return (
    <Box
      role="navigation"
      aria-label="Begutachtungsfortschritt"
      sx={{ width: '100%', mb: 3, mt: 1 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 1,
          position: 'relative',
        }}
      >
        {/* Verbindungslinie hinter den Punkten */}
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            right: 16,
            height: 2,
            bgcolor: 'divider',
            zIndex: 0,
          }}
        />
        {steps.map((step, index) => {
          const aktiv = index === activeIndex;
          const erledigt = istErledigt(step);
          const labelText = aktiv ? step.label : step.kurzlabel;
          const farbe = erledigt
            ? theme.palette.success.main
            : aktiv
              ? theme.palette.primary.main
              : theme.palette.action.disabled;
          return (
            <Box
              key={step.pfad}
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: '1 1 0',
                minWidth: 0,
              }}
            >
              <Tooltip title={step.label} placement="top">
                <Box
                  component="button"
                  type="button"
                  aria-label={`Springe zu ${step.label}`}
                  aria-current={aktiv ? 'step' : undefined}
                  onClick={() => navigate(step.pfad)}
                  sx={{
                    cursor: 'pointer',
                    border: 'none',
                    p: 0,
                    bgcolor: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: aktiv ? 40 : 28,
                    height: aktiv ? 40 : 28,
                    borderRadius: '50%',
                    color: aktiv || erledigt ? '#fff' : theme.palette.text.secondary,
                    backgroundColor: farbe,
                    transition: 'all 120ms ease-in-out',
                    fontSize: aktiv ? 14 : 12,
                    fontWeight: 600,
                    boxShadow: aktiv ? 4 : 0,
                    '&:hover': {
                      filter: 'brightness(1.05)',
                    },
                    '&:focus-visible': {
                      outline: `2px solid ${theme.palette.primary.main}`,
                      outlineOffset: 2,
                    },
                  }}
                >
                  {erledigt && !aktiv ? <CheckIcon fontSize="small" /> : kurzInhalt(step)}
                </Box>
              </Tooltip>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  textAlign: 'center',
                  color: aktiv ? 'text.primary' : 'text.secondary',
                  fontWeight: aktiv ? 600 : 400,
                  whiteSpace: aktiv ? 'normal' : 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                }}
              >
                {labelText}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <LinearProgress
            variant="determinate"
            value={fortschritt.prozent}
            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ minWidth: 64, textAlign: 'right' }}>
            {fortschritt.bewertet}/{fortschritt.gesamt} Kriterien
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

function kurzInhalt(step: Step): string {
  if (step.kind === 'modul') return String(step.modulId);
  if (step.kind === 'stammdaten') return 'S';
  return 'A';
}
