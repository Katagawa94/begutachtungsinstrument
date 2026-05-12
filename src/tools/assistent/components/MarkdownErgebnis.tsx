import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { MarkdownDarstellung } from './MarkdownDarstellung';

type Ansicht = 'roh' | 'vorschau';

type Props = {
  ausgabe: string;
  onAusgabeChange: (text: string) => void;
  laeuft: boolean;
  onKopieren: () => void;
  onHerunterladen: () => void;
  onDrucken: () => void;
};

export function MarkdownErgebnis({
  ausgabe,
  onAusgabeChange,
  laeuft,
  onKopieren,
  onHerunterladen,
  onDrucken,
}: Props) {
  const [ansicht, setAnsicht] = useState<Ansicht>('roh');
  const hatInhalt = ausgabe.trim().length > 0;

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
          sx={{ minHeight: 0, flexGrow: 1 }}
        >
          <Tab value="roh" label="Markdown (bearbeitbar)" sx={{ minHeight: 40 }} />
          <Tab value="vorschau" label="Vorschau" sx={{ minHeight: 40 }} disabled={!hatInhalt} />
        </Tabs>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={onKopieren} disabled={!hatInhalt}>
            Kopieren
          </Button>
          <Button size="small" variant="outlined" startIcon={<DownloadIcon />} onClick={onHerunterladen} disabled={!hatInhalt}>
            .md
          </Button>
          <Button size="small" variant="contained" startIcon={<PrintIcon />} onClick={onDrucken} disabled={!hatInhalt}>
            Als PDF drucken
          </Button>
        </Stack>
      </Stack>

      {ansicht === 'vorschau' ? (
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, maxHeight: 520, overflow: 'auto' }}>
          <MarkdownDarstellung markdown={ausgabe} />
        </Box>
      ) : (
        <Box
          component="textarea"
          value={ausgabe}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onAusgabeChange(e.target.value)}
          readOnly={laeuft}
          aria-label="Generierter Markdown-Text"
          placeholder={laeuft ? 'Der Text wird erzeugt …' : 'Hier erscheint der generierte Markdown-Text.'}
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
