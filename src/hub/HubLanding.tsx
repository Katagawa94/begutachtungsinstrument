import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link as RouterLink } from 'react-router-dom';

type Tool = {
  id: string;
  title: string;
  description: string;
  to: string;
  status: 'verfügbar' | 'in Arbeit' | 'geplant';
  icon: React.ReactNode;
};

const tools: Tool[] = [
  {
    id: 'begutachtung',
    title: 'Begutachtungsinstrument',
    description:
      'Strukturierte Erfassung der sechs Module nach SGB XI inkl. Pflegegrad-Berechnung und PDF-Export.',
    to: '/begutachtung',
    status: 'in Arbeit',
    icon: <AssignmentIcon fontSize="large" color="primary" />,
  },
];

export function HubLanding() {
  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h1">Werkzeuge für Pflegesachverständige</Typography>
        <Typography variant="body1" color="text.secondary">
          Wähle ein Tool aus. Alle Daten verbleiben lokal in deinem Browser.
        </Typography>
      </Stack>
      <Grid container spacing={3}>
        {tools.map((tool) => (
          <Grid key={tool.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea component={RouterLink} to={tool.to} sx={{ height: '100%' }}>
                <CardContent>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                    {tool.icon}
                    <Typography variant="h3" component="h2">
                      {tool.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tool.description}
                  </Typography>
                  <Chip size="small" label={tool.status} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
