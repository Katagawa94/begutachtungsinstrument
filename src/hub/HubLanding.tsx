import type { ReactNode } from 'react';
import Grid from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Link as RouterLink } from 'react-router-dom';

type Akzent = 'primary' | 'secondary' | 'success';

type Tool = {
  id: string;
  title: string;
  description: string;
  to: string;
  status: 'verfügbar' | 'in Arbeit' | 'geplant';
  icon: ReactNode;
  akzent: Akzent;
};

const tools: Tool[] = [
  {
    id: 'begutachtung',
    title: 'Begutachtungsinstrument',
    description:
      'Strukturierte Erfassung der sechs Module nach SGB XI inkl. Pflegegrad-Berechnung und PDF-Export.',
    to: '/begutachtung',
    status: 'in Arbeit',
    icon: <AssignmentIcon fontSize="large" />,
    akzent: 'primary',
  },
  {
    id: 'anonymisierung',
    title: 'Anonymisierung',
    description:
      'Beliebige Dateien lokal nach Markdown konvertieren und vor der Weitergabe an eine KI anonymisieren.',
    to: '/anonymisierung',
    status: 'in Arbeit',
    icon: <ShieldOutlinedIcon fontSize="large" />,
    akzent: 'secondary',
  },
  {
    id: 'assistent',
    title: 'Textassistent',
    description:
      'Lokales Sprachmodell im Browser: aus gespeicherten „Skills" Markdown-Entwürfe erzeugen und als PDF drucken.',
    to: '/assistent',
    status: 'in Arbeit',
    icon: <AutoFixHighIcon fontSize="large" />,
    akzent: 'success',
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
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                overflow: 'hidden',
                position: 'relative',
                transition: (theme) =>
                  theme.transitions.create(['box-shadow', 'border-color', 'transform']),
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  insetInlineStart: 0,
                  insetBlock: 0,
                  width: 4,
                  bgcolor: `${tool.akzent}.main`,
                },
                '&:hover': {
                  borderColor: `${tool.akzent}.main`,
                  boxShadow: 4,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardActionArea component={RouterLink} to={tool.to} sx={{ height: '100%' }}>
                <CardContent sx={{ pl: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1.5 }}>
                    <Box
                      sx={(theme) => ({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        color: `${tool.akzent}.main`,
                        bgcolor: alpha(theme.palette[tool.akzent].main, 0.12),
                      })}
                    >
                      {tool.icon}
                    </Box>
                    <Typography variant="h3" component="h2">
                      {tool.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tool.description}
                  </Typography>
                  <Chip size="small" color={tool.akzent} variant="outlined" label={tool.status} />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
