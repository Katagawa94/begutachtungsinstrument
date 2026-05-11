import { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Alert from '@mui/material/Alert';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import type { RuntimeStatus } from '../markitdown/pyodideRuntime';

type Props = {
  status: RuntimeStatus;
  dateiname: string | null;
  onDatei: (file: File) => void;
};

export function DateiUpload({ status, dateiname, onDatei }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const beschaeftigt = status.phase === 'laden';

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) onDatei(file);
  }

  return (
    <Box>
      <Box
        onDragOver={(e) => {
          e.preventDefault();
          if (!beschaeftigt) setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (!beschaeftigt) handleFiles(e.dataTransfer.files);
        }}
        sx={(theme) => ({
          border: '2px dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: { xs: 3, sm: 5 },
          textAlign: 'center',
          bgcolor: dragActive ? 'action.hover' : 'transparent',
          transition: theme.transitions.create(['border-color', 'background-color']),
          opacity: beschaeftigt ? 0.6 : 1,
        })}
      >
        <Stack spacing={1.5} alignItems="center">
          <UploadFileIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="body1">Datei hierher ziehen oder auswählen</Typography>
          <Typography variant="caption" color="text.secondary">
            Word, PDF (Textebene), PowerPoint, Excel/CSV, HTML, Text/Markdown u. a.
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            onClick={() => inputRef.current?.click()}
            disabled={beschaeftigt}
          >
            Datei auswählen
          </Button>
          <input
            ref={inputRef}
            type="file"
            hidden
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </Stack>
      </Box>

      {dateiname && status.phase !== 'laden' ? (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
          <DescriptionIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            Geladen: <strong>{dateiname}</strong>
          </Typography>
        </Stack>
      ) : null}

      {status.phase === 'laden' ? (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {status.text}
          </Typography>
          <LinearProgress />
        </Box>
      ) : null}

      {status.phase === 'fehler' ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {status.fehler}
        </Alert>
      ) : null}
    </Box>
  );
}
