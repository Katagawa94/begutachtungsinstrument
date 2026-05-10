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
import { styled, alpha } from '@mui/material/styles';
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

const Connector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 14,
    left: 'calc(-50% + 18px)',
    right: 'calc(50% + 18px)',
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
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 13,
    transition: 'all 180ms ease',
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
      width: 36,
      height: 36,
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
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
  const fortschritt = berechneFortschritt(bewertungen);

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
      <Stepper
        alternativeLabel
        activeStep={activeIndex < 0 ? 0 : activeIndex}
        connector={<Connector />}
        nonLinear
      >
        {steps.map((step) => {
          const erledigt = istErledigt(step);
          return (
            <Step key={step.pfad} completed={erledigt}>
              <StepButton onClick={() => navigate(step.pfad)} sx={{ py: 0.5 }}>
                <StepLabel
                  slots={{ stepIcon: makeStepIcon(step) }}
                  sx={{
                    '& .MuiStepLabel-label': {
                      mt: 1,
                      fontSize: 12,
                      minHeight: 32,
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
                  {labelFuer(step)}
                </StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ mt: 2, px: { xs: 0, sm: 1 } }}
      >
        <LinearProgress
          variant="determinate"
          value={fortschritt.prozent}
          sx={{
            flexGrow: 1,
            height: 6,
            borderRadius: 3,
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 96, textAlign: 'right' }}>
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
