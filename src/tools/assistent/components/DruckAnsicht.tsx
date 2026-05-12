import GlobalStyles from '@mui/material/GlobalStyles';
import Box from '@mui/material/Box';
import { MarkdownDarstellung } from './MarkdownDarstellung';

/**
 * Druck-Ansicht: am Bildschirm versteckt, im Druck wird alles andere
 * ausgeblendet und nur dieser (gerenderte) Markdown-Block auf die Seite gelegt.
 * Damit erzeugt der Browser-„Drucken/Als PDF speichern"-Dialog ein sauberes
 * Dokument.
 */
export function DruckAnsicht({ markdown }: { markdown: string }) {
  return (
    <>
      <GlobalStyles
        styles={{
          '@media print': {
            'body *': { visibility: 'hidden' },
            '.druck-ansicht, .druck-ansicht *': { visibility: 'visible' },
            '.druck-ansicht': { position: 'absolute', left: 0, top: 0, width: '100%' },
          },
          '@page': { margin: '2cm' },
        }}
      />
      <Box
        className="druck-ansicht"
        sx={{
          display: 'none',
          '@media print': {
            display: 'block',
            color: '#000',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          },
        }}
      >
        <MarkdownDarstellung markdown={markdown} />
      </Box>
    </>
  );
}
