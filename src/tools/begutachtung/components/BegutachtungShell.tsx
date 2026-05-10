import { Link as RouterLink, Outlet, useLocation, useParams } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import { useBegutachtungen } from '../state/useBegutachtungen';
import { buildSteps, findActiveStepIndex } from '../navigation';
import { FortschrittStepper } from './FortschrittStepper';
import type { Stammdaten } from '../state/schema';

export function BegutachtungShell() {
  const { id = '' } = useParams<{ id: string }>();
  const location = useLocation();
  const { finden } = useBegutachtungen();
  const begutachtung = finden(id);

  if (!begutachtung) {
    return (
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h1">Begutachtung nicht gefunden</Typography>
        <Alert severity="warning">
          Die angeforderte Begutachtung existiert nicht (mehr).
        </Alert>
        <Button component={RouterLink} to="/begutachtung" variant="contained">
          Zur Übersicht
        </Button>
      </Stack>
    );
  }

  const steps = buildSteps(id);
  const activeIndex = findActiveStepIndex(steps, location.pathname);

  return (
    <Stack spacing={1}>
      <FortschrittStepper
        steps={steps}
        activeIndex={activeIndex}
        bewertungen={begutachtung.bewertungen}
        stammdatenVollstaendig={istStammdatenVollstaendig(begutachtung.stammdaten)}
      />
      <Outlet />
    </Stack>
  );
}

function istStammdatenVollstaendig(s: Stammdaten): boolean {
  return Boolean(
    s.person.name.trim() &&
      s.person.geburtsdatum &&
      s.gutachter.name.trim() &&
      s.termin.datum,
  );
}
