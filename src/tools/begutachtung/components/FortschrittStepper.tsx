import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, alpha, useTheme } from '@mui/material/styles';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import type { StepIconProps } from '@mui/material/StepIcon';
import type { Step as PsvStep } from '../navigation';
import { berechneFortschritt, berechneModulFortschritt } from '../domain/scoring';
import type { Bewertungen } from '../domain/types';

type Props = {
  steps: PsvStep[];
  activeIndex: number;
  bewertungen: Bewertungen;
  stammdatenVollstaendig: boolean;
};

const ICON_SIZE = 30;

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: ICON_SIZE / 2 - 1, // mittig auf den Step-Icons
    left: `calc(-50% + ${ICON_SIZE / 2 + 4}px)`,
    right: `calc(50% + ${ICON_SIZE / 2 + 4}px)`,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    backgroundImage: `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.primary.main} 100%)`,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    backgroundColor: theme.palette.success.main,
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    borderRadius: 2,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey[200],
    transition: 'background-color 200ms ease, background-image 200ms ease',
  },
}));

const StepIconRoot = styled('div', {
  shouldForwardProp: (prop) => prop !== 'ownerActive' && prop !== 'ownerCompleted',
})<{ ownerActive: boolean; ownerCompleted: boolean }>(
  ({ theme, ownerActive, ownerCompleted }) => ({
    width: ICON_SIZE,
    height: ICON_SIZE,
    boxSizing: 'border-box',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13,
    transition:
      'background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease, color 180ms ease',
    color: theme.palette.text.secondary,
    backgroundColor:
      theme.palette.mode === 'dark' ? alpha(theme.palette.text.primary, 0.08) : '#fff',
    border: `2px solid ${
      theme.palette.mode === 'dark' ? theme.palette.divider : theme.palette.grey[300]
    }`,
    ...(ownerCompleted && {
      backgroundColor: theme.palette.success.main,
      borderColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
    }),
    ...(ownerActive && {
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.22)}`,
    }),
  }),
);

function makeStepIcon(step: PsvStep) {
  return function StepIcon(props: StepIconProps) {
    const { active = false, completed = false } = props;
    return (
      <StepIconRoot ownerActive={active} ownerCompleted={completed}>
        {completed ? (
          <CheckRoundedIcon fontSize="small" />
        ) : step.kind === 'stammdaten' ? (
          <PersonRoundedIcon fontSize="small" />
        ) : step.kind === 'abschluss' ? (
          <FlagRoundedIcon fontSize="small" />
        ) : (
          step.modulId
        )}
      </StepIconRoot>
    );
  };
}

export function FortschrittStepper({
  steps,
  activeIndex,
  bewertungen,
  stammdatenVollstaendig,
}: Props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const kompakt = useMediaQuery(theme.breakpoints.down('sm'));
  const fortschritt = berechneFortschritt(bewertungen);
  const aktiverIndex = activeIndex < 0 ? 0 : activeIndex;
  const aktiverStep = steps[aktiverIndex];

  function istErledigt(step: PsvStep): boolean {
    if (step.kind === 'stammdaten') return stammdatenVollstaendig;
    if (step.kind === 'modul') {
      return berechneModulFortschritt(step.modulId, bewertungen).vollstaendig;
    }
    return false;
  }

  return (
    <Box
      role="navigation"
      aria-label="Begutachtungsfortschritt"
      sx={{ width: '100%', mb: 3, mt: 1 }}
    >
      {kompakt && aktiverStep ? (
        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
          Schritt {aktiverIndex + 1} von {steps.length}: {aktiverStep.label}
        </Typography>
      ) : null}

      <Box sx={{ overflowX: 'auto', pb: kompakt ? 0.5 : 0 }}>
        <Stepper
          alternativeLabel
          activeStep={aktiverIndex}
          connector={<Connector />}
          nonLinear
          sx={{ minWidth: kompakt ? steps.length * 38 : undefined }}
        >
          {steps.map((step, index) => {
            const erledigt = istErledigt(step);
            const istAktiv = index === aktiverIndex;
            return (
              <Step key={step.pfad} completed={erledigt}>
                <StepButton
                  onClick={() => navigate(step.pfad)}
                  aria-current={istAktiv ? 'step' : undefined}
                  aria-label={`${step.label}${erledigt ? ' (abgeschlossen)' : ''}`}
                >
                  <StepLabel
                    slots={{ stepIcon: makeStepIcon(step) }}
                    sx={{
                      '& .MuiStepLabel-label': {
                        mt: kompakt ? 0 : 1,
                        fontSize: 12,
                        minHeight: kompakt ? 0 : 32,
                        lineHeight: 1.25,
                      },
                      '& .MuiStepLabel-label.Mui-active': {
                        fontWeight: 600,
                        color: 'text.primary',
                      },
                      '& .MuiStepLabel-label.Mui-completed': {
                        color: 'text.secondary',
                      },
                    }}
                  >
                    {kompakt ? '' : labelFuer(step)}
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ mt: 2, px: { xs: 0, sm: 1 } }}
      >
        <LinearProgress
          variant="determinate"
          value={fortschritt.prozent}
          aria-label="Gesamtfortschritt der Begutachtung"
          sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ minWidth: 92, textAlign: 'right' }}
        >
          {fortschritt.bewertet} / {fortschritt.gesamt} Kriterien
        </Typography>
      </Stack>
    </Box>
  );
}

function labelFuer(step: PsvStep): string {
  if (step.kind === 'stammdaten') return 'Stammdaten';
  if (step.kind === 'abschluss') return 'Abschluss';
  return `Modul ${step.modulId}`;
}
