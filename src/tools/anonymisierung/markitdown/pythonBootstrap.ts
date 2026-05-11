/**
 * Python-Code, der einmalig nach dem Laden von Pyodide ausgeführt wird:
 *
 * 1. Stub für `magika`, weil dessen ONNX-Runtime in Pyodide nicht verfügbar ist.
 *    MarkItDown konstruiert ein Magika-Objekt, ruft es aber nicht auf, solange wir
 *    beim Konvertieren immer einen Dateipfad mit Endung übergeben.
 * 2. Installation von MarkItDown (ohne Abhängigkeitsauflösung) plus der rein in
 *    Python geschriebenen Konverter-Abhängigkeiten. Binär-Wheels (lxml, Pillow)
 *    holt Pyodide automatisch aus seinem eigenen Repo. `pandas`/`openpyxl` werden
 *    bei Bedarf nachgeladen (siehe ensurePandas im TypeScript-Modul).
 * 3. Definition einer `konvertiere(pfad)`-Funktion mit MarkItDown als Primärpfad
 *    und einem schlanken Fallback-Dispatcher.
 */
export const PYTHON_BOOTSTRAP = String.raw`
import sys, types, importlib

# --- magika-Stub -------------------------------------------------------------
if 'magika' not in sys.modules:
    _magika = types.ModuleType('magika')
    class Magika:  # noqa: N801
        def __init__(self, *args, **kwargs):
            pass
        def identify_bytes(self, *args, **kwargs):
            raise NotImplementedError('magika ist im Browser nicht verfuegbar')
        def identify_stream(self, *args, **kwargs):
            raise NotImplementedError('magika ist im Browser nicht verfuegbar')
        def identify_path(self, *args, **kwargs):
            raise NotImplementedError('magika ist im Browser nicht verfuegbar')
    _magika.Magika = Magika
    sys.modules['magika'] = _magika

# --- Installation ------------------------------------------------------------
import micropip
await micropip.install('markitdown', deps=False)
await micropip.install([
    'beautifulsoup4',
    'markdownify',
    'charset-normalizer',
    'defusedxml',
    'mammoth',
    'python-pptx',
    'olefile',
    'XlsxWriter',
    'openpyxl',
    'pdfminer.six',
])

# --- MarkItDown verfuegbar? --------------------------------------------------
try:
    import markitdown  # noqa: F401
    MARKITDOWN_OK = True
except Exception:  # noqa: BLE001
    MARKITDOWN_OK = False

# --- Konvertierungsfunktion --------------------------------------------------
def konvertiere(pfad):
    import os
    ext = os.path.splitext(pfad)[1].lower()

    if MARKITDOWN_OK:
        try:
            md = markitdown.MarkItDown(enable_plugins=False)
        except TypeError:
            md = markitdown.MarkItDown()
        result = md.convert(pfad)
        text = getattr(result, 'markdown', None) or getattr(result, 'text_content', None) or ''
        return text

    # --- Fallback-Dispatcher (ohne MarkItDown) ---
    if ext in ('', '.md', '.markdown', '.txt', '.text'):
        with open(pfad, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()
    if ext == '.docx':
        import mammoth, markdownify
        with open(pfad, 'rb') as f:
            html = mammoth.convert_to_html(f).value
        return markdownify.markdownify(html)
    if ext in ('.html', '.htm'):
        import markdownify
        with open(pfad, 'r', encoding='utf-8', errors='replace') as f:
            return markdownify.markdownify(f.read())
    if ext == '.pdf':
        from pdfminer.high_level import extract_text
        return extract_text(pfad)
    if ext in ('.xlsx', '.xlsm'):
        import openpyxl
        wb = openpyxl.load_workbook(pfad, read_only=True, data_only=True)
        out = []
        for ws in wb.worksheets:
            out.append('## ' + str(ws.title))
            out.append('')
            for row in ws.iter_rows(values_only=True):
                cells = ['' if c is None else str(c) for c in row]
                out.append('| ' + ' | '.join(cells) + ' |')
            out.append('')
        return '\n'.join(out)
    if ext == '.csv':
        import csv
        with open(pfad, 'r', encoding='utf-8', errors='replace', newline='') as f:
            rows = list(csv.reader(f))
        if not rows:
            return ''
        head = rows[0]
        out = ['| ' + ' | '.join(head) + ' |', '| ' + ' | '.join(['---'] * len(head)) + ' |']
        for r in rows[1:]:
            out.append('| ' + ' | '.join(r) + ' |')
        return '\n'.join(out)
    if ext == '.pptx':
        import pptx
        prs = pptx.Presentation(pfad)
        out = []
        for i, slide in enumerate(prs.slides, 1):
            out.append('## Folie ' + str(i))
            out.append('')
            for shape in slide.shapes:
                if getattr(shape, 'has_text_frame', False):
                    for p in shape.text_frame.paragraphs:
                        t = ''.join(run.text for run in p.runs).strip()
                        if t:
                            out.append(t)
            out.append('')
        return '\n'.join(out)
    raise ValueError('Dateityp ' + (ext or '(ohne Endung)') + ' wird nicht unterstuetzt.')
`;

/** Installiert pandas+openpyxl on demand für die MarkItDown-XLSX-Konvertierung. */
export const PYTHON_ENSURE_PANDAS = String.raw`
import micropip
try:
    import pandas  # noqa: F401
except ImportError:
    await micropip.install(['pandas', 'openpyxl'])
`;
