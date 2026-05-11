import Box from '@mui/material/Box';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Gerenderte Markdown-Vorschau. react-markdown rendert standardmäßig kein rohes
 * HTML aus dem Markdown — eingebettetes HTML/Script wird also nicht ausgeführt.
 */
export default function MarkdownVorschau({ markdown }: { markdown: string }) {
  return (
    <Box
      sx={{
        '& table': { borderCollapse: 'collapse', width: '100%', my: 1 },
        '& th, & td': { border: 1, borderColor: 'divider', px: 1, py: 0.5, textAlign: 'left' },
        '& pre': {
          bgcolor: 'action.hover',
          p: 1.5,
          borderRadius: 1,
          overflowX: 'auto',
        },
        '& code': { fontFamily: 'monospace' },
        '& img': { maxWidth: '100%' },
        '& blockquote': {
          borderLeft: 3,
          borderColor: 'divider',
          pl: 1.5,
          color: 'text.secondary',
          my: 1,
        },
        '& h1, & h2, & h3': { mt: 2, mb: 1 },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </Box>
  );
}
