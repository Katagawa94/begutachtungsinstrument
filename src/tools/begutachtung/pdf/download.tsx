import type { Begutachtung } from '../state/schema';
import { sieht_nach_chunk_fehler_aus } from '../../../app/chunkReload';

export async function downloadBegutachtungPdf(begutachtung: Begutachtung): Promise<void> {
  let renderer: typeof import('@react-pdf/renderer');
  let doc: typeof import('./BegutachtungPdf');
  let dataMod: typeof import('./pdfData');
  try {
    // Dynamischer Import: @react-pdf/renderer ist groß und bleibt aus dem Initialbundle.
    [renderer, doc, dataMod] = await Promise.all([
      import('@react-pdf/renderer'),
      import('./BegutachtungPdf'),
      import('./pdfData'),
    ]);
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (sieht_nach_chunk_fehler_aus(message)) {
      throw new Error(
        'Die App wurde aktualisiert. Bitte lade die Seite neu und versuche es erneut.',
      );
    }
    throw e;
  }

  const data = dataMod.buildPdfData(begutachtung);
  const blob = await renderer.pdf(<doc.BegutachtungPdfDocument data={data} />).toBlob();
  triggerBlobDownload(blob, dataMod.pdfDateinameFuer(data));
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
