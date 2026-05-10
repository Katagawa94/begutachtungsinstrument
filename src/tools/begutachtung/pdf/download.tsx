import type { Begutachtung } from '../state/schema';

export async function downloadBegutachtungPdf(begutachtung: Begutachtung): Promise<void> {
  // Dynamischer Import: @react-pdf/renderer ist groß und bleibt aus dem Initialbundle.
  const [{ pdf }, { BegutachtungPdfDocument }, { buildPdfData, pdfDateinameFuer }] =
    await Promise.all([
      import('@react-pdf/renderer'),
      import('./BegutachtungPdf'),
      import('./pdfData'),
    ]);
  const data = buildPdfData(begutachtung);
  const blob = await pdf(<BegutachtungPdfDocument data={data} />).toBlob();
  triggerBlobDownload(blob, pdfDateinameFuer(data));
}

function triggerBlobDownload(blob: Blob, dateiname: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = dateiname;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
