import { Suspense, lazy, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';

const MarkdownVorschau = lazy(() => import('./MarkdownVorschau'));

type Ansicht = 'anonymisiert' | 'original' | 'vorschau';

type Props = {
  original: string;
  anonymisiert: string;
  gesamtAnzahl: number;
  onKopieren: () => void;
  onHerunterladen: () => void;
};

export function MarkdownAnsicht({
  original,
  anonymisiert,
  gesamtAnzahl,
  onKopieren,
  onHerunterladen,
}: Props) {
  const [ansicht, setAnsicht] = useState<Ansicht>('anonymisiert');

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{ mb: 1 }}
      >
        <Tabs
          value={ansicht}
          onChange={(_e, v: Ansicht) => setAnsicht(v)}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{ minHeight: 0, flexGrow: 1 }}
        >
          <Tab value="anonymisiert" label="Anonymisiert (Roh)" sx={{ minHeight: 40 }} />
          <Tab value="original" label="Original" sx={{ minHeight: 40 }} />
          <Tab value="vorschau" label="Vorschau" sx={{ minHeight: 40 }} />
        </Tabs>
        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopyIcon />}
            onClick={onKopieren}
          >
            Kopieren
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onHerunterladen}
          >
            .md herunterladen
          </Button>
        </Stack>
      </Stack>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        {ansicht === 'anonymisiert'
          ? `Dieser Text wird kopiert/heruntergeladen — ${gesamtAnzahl} ${
              gesamtAnzahl === 1 ? 'Ersetzung' : 'Ersetzungen'
            } angewendet.`
          : ansicht === 'original'
            ? 'Unveränderter Markdown-Text aus der Datei.'
            : 'Gerenderte Vorschau des anonymisierten Texts (kein rohes HTML).'}
      </Typography>

      {ansicht === 'vorschau' ? (
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            p: 2,
            maxHeight: 520,
            overflow: 'auto',
          }}
        >
          <Suspense fallback={<CircularProgress size={20} />}>
            <MarkdownVorschau markdown={anonymisiert} />
          </Suspense>
        </Box>
      ) : (
        <Box
          component="textarea"
          readOnly
          value={ansicht === 'original' ? original : anonymisiert}
          aria-label={ansicht === 'original' ? 'Original-Markdown' : 'Anonymisierter Markdown-Text'}
          sx={(theme) => ({
            width: '100%',
            minHeight: 320,
            maxHeight: 520,
            resize: 'vertical',
            p: 1.5,
            fontFamily: 'monospace',
            fontSize: 13,
            lineHeight: 1.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper',
            color: 'text.primary',
            outline: 'none',
            '&:focus-visible': { borderColor: theme.palette.primary.main },
          })}
        />
      )}
    </Box>
  );
}
