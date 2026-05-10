import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { PdfData, PdfKriterium, PdfModul } from './pdfData';
import { formatDate } from '../utils/format';

const colors = {
  primary: '#1976d2',
  text: '#1f2937',
  muted: '#6b7280',
  border: '#d1d5db',
  rowAlt: '#f9fafb',
  success: '#15803d',
};

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: colors.text,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 8,
    marginTop: 16,
  },
  modulHinweis: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  stammdatenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  stammdatenZelle: {
    width: '50%',
    paddingVertical: 4,
    paddingRight: 8,
  },
  stammdatenLabel: {
    fontSize: 8,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  stammdatenWert: {
    fontSize: 11,
    marginTop: 2,
  },
  ergebnisBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    backgroundColor: '#eff6ff',
    marginVertical: 8,
  },
  pflegegradLabel: {
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  pflegegradWert: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: colors.primary,
    marginTop: 2,
  },
  pflegegradPunkte: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 2,
  },
  ergebnisRechts: {
    flexGrow: 1,
    paddingLeft: 16,
  },
  ergebnisRechtsZeile: {
    fontSize: 10,
    marginTop: 2,
  },
  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: colors.rowAlt,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  cell: {
    padding: 6,
    fontSize: 10,
  },
  cellModul: { width: '52%' },
  cellEinzel: { width: '14%', textAlign: 'right' },
  cellSg: { width: '12%', textAlign: 'center' },
  cellGewicht: { width: '14%', textAlign: 'right' },
  cellNotiz: { width: '8%', textAlign: 'center', fontSize: 8, color: colors.muted },
  ausgegraut: {
    color: colors.muted,
  },
  kriteriumZeile: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  kriteriumId: {
    width: '8%',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  kriteriumName: {
    width: '40%',
    paddingRight: 6,
    fontSize: 10,
  },
  kriteriumWert: {
    width: '22%',
    fontSize: 9,
  },
  kriteriumPunkte: {
    width: '10%',
    fontSize: 9,
    textAlign: 'right',
  },
  kriteriumKommentar: {
    width: '20%',
    fontSize: 8,
    color: colors.muted,
    fontStyle: 'italic',
  },
  modulSubtotal: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: colors.primary,
    backgroundColor: colors.rowAlt,
  },
  subtotalLabel: {
    flexGrow: 1,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  subtotalWert: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    marginLeft: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: colors.muted,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  modulHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  modulTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
  },
  modulMeta: {
    fontSize: 9,
    color: colors.muted,
  },
  pageBreak: {
    pageBreakBefore: true,
  },
});

type DocProps = { data: PdfData };

export function BegutachtungPdfDocument({ data }: DocProps) {
  const { begutachtung, ergebnis, module, erstelltAm } = data;
  const { stammdaten } = begutachtung;
  const erstelltAmFmt = formatDate(erstelltAm);
  const personenname = stammdaten.person.name.trim() || 'Begutachtete Person';

  return (
    <Document
      title={`Pflegegutachten – ${personenname}`}
      author={stammdaten.gutachter.name || undefined}
      subject="Begutachtungsinstrument nach SGB XI"
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header} fixed>
          <Text style={styles.title}>Pflegegutachten</Text>
          <Text style={styles.subtitle}>Begutachtungsinstrument nach SGB XI · NBA</Text>
        </View>

        <Text style={styles.sectionTitle}>Stammdaten</Text>
        <View style={styles.stammdatenGrid}>
          <Stammfeld label="Begutachtete Person" wert={personenname} />
          <Stammfeld
            label="Geburtsdatum"
            wert={stammdaten.person.geburtsdatum ? formatDate(stammdaten.person.geburtsdatum) : '–'}
          />
          <Stammfeld label="Gutachter:in" wert={stammdaten.gutachter.name || '–'} />
          <Stammfeld
            label="Begutachtungstermin"
            wert={[
              stammdaten.termin.datum ? formatDate(stammdaten.termin.datum) : null,
              stammdaten.termin.ort || null,
            ]
              .filter(Boolean)
              .join(' · ') || '–'}
          />
          <Stammfeld label="Pflegekasse" wert={stammdaten.versicherung.traeger || '–'} />
          <Stammfeld label="Aktenzeichen" wert={stammdaten.versicherung.aktenzeichen || '–'} />
        </View>

        <Text style={styles.sectionTitle}>Ergebnis</Text>
        <View style={styles.ergebnisBox}>
          <View>
            <Text style={styles.pflegegradLabel}>Pflegegrad</Text>
            <Text style={styles.pflegegradWert}>
              {ergebnis.pflegegrad === 0 ? '–' : `PG ${ergebnis.pflegegrad}`}
            </Text>
            <Text style={styles.pflegegradPunkte}>{ergebnis.gesamtpunkte} gewichtete Punkte</Text>
          </View>
          <View style={styles.ergebnisRechts}>
            <Text style={styles.ergebnisRechtsZeile}>{ergebnis.pflegegradBezeichnung}</Text>
            <Text style={styles.ergebnisRechtsZeile}>
              Schwellen § 15 SGB XI: PG 1 ab 12,5 · PG 2 ab 27 · PG 3 ab 47,5 · PG 4 ab 70 · PG 5 ab 90
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Modulübersicht</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, styles.cellModul]}>Modul</Text>
            <Text style={[styles.cell, styles.cellEinzel]}>Einzelpunkte</Text>
            <Text style={[styles.cell, styles.cellSg]}>SG</Text>
            <Text style={[styles.cell, styles.cellGewicht]}>Gewichtet</Text>
            <Text style={[styles.cell, styles.cellNotiz]}> </Text>
          </View>
          {module.map((m, idx) => {
            const ausgegraut = m.ergebnis.fliesstInGesamtwertungEin === false;
            const istLetzte = idx === module.length - 1;
            return (
              <View key={m.id} style={istLetzte ? styles.tableRowLast : styles.tableRow}>
                <Text
                  style={[
                    styles.cell,
                    styles.cellModul,
                    ausgegraut ? styles.ausgegraut : {},
                  ]}
                >
                  Modul {m.id} — {m.name} ({m.gewichtungProzent} %)
                </Text>
                <Text style={[styles.cell, styles.cellEinzel, ausgegraut ? styles.ausgegraut : {}]}>
                  {m.ergebnis.einzelpunkte}
                </Text>
                <Text style={[styles.cell, styles.cellSg, ausgegraut ? styles.ausgegraut : {}]}>
                  {m.ergebnis.schweregrad}
                </Text>
                <Text
                  style={[styles.cell, styles.cellGewicht, ausgegraut ? styles.ausgegraut : {}]}
                >
                  {m.ergebnis.gewichtetePunkte}
                </Text>
                <Text style={[styles.cell, styles.cellNotiz]}>
                  {ausgegraut ? '(ohne)' : ''}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={[styles.modulHinweis, { marginTop: 4 }]}>
          Hinweis: Bei Modul 2 und Modul 3 fließt nur der höhere gewichtete Punktwert in die
          Gesamtsumme ein (§ 15 SGB XI). Die nicht gewertete Zeile ist hellgrau dargestellt.
        </Text>

        <PdfFooter erstelltAm={erstelltAmFmt} />
      </Page>

      {module.map((m) => (
        <ModulSeite key={m.id} modul={m} erstelltAm={erstelltAmFmt} />
      ))}
    </Document>
  );
}

function Stammfeld({ label, wert }: { label: string; wert: string }) {
  return (
    <View style={styles.stammdatenZelle}>
      <Text style={styles.stammdatenLabel}>{label}</Text>
      <Text style={styles.stammdatenWert}>{wert}</Text>
    </View>
  );
}

function ModulSeite({ modul, erstelltAm }: { modul: PdfModul; erstelltAm: string }) {
  return (
    <Page size="A4" style={styles.page} wrap>
      <View style={styles.header} fixed>
        <Text style={styles.title}>Pflegegutachten</Text>
        <Text style={styles.subtitle}>Begutachtungsinstrument nach SGB XI · NBA</Text>
      </View>
      <View style={styles.modulHeader}>
        <Text style={styles.modulTitle}>
          Modul {modul.id} — {modul.name}
        </Text>
        <Text style={styles.modulMeta}>Gewichtung {modul.gewichtungProzent} %</Text>
      </View>
      <Text style={styles.modulHinweis}>{modul.einleitung}</Text>

      <View style={styles.table}>
        <View style={[styles.kriteriumZeile, styles.tableHeader]} fixed>
          <Text style={[styles.kriteriumId, { fontSize: 9 }]}>Nr.</Text>
          <Text style={styles.kriteriumName}>Kriterium</Text>
          <Text style={styles.kriteriumWert}>Bewertung</Text>
          <Text style={styles.kriteriumPunkte}>Punkte</Text>
          <Text style={styles.kriteriumKommentar}>Kommentar</Text>
        </View>
        {modul.kriterien.map((k) => (
          <KriteriumZeile key={k.id} k={k} />
        ))}
      </View>

      <View style={styles.modulSubtotal}>
        <Text style={styles.subtotalLabel}>
          Modul-Summe: {modul.ergebnis.einzelpunkte} Einzelpunkte · Schweregrad{' '}
          {modul.ergebnis.schweregrad} ({modul.ergebnis.schweregradBezeichnung})
        </Text>
        <Text style={styles.subtotalWert}>{modul.ergebnis.gewichtetePunkte} gew. P.</Text>
      </View>

      <PdfFooter erstelltAm={erstelltAm} />
    </Page>
  );
}

function KriteriumZeile({ k }: { k: PdfKriterium }) {
  const nichtBewertet = k.wert === null;
  return (
    <View style={styles.kriteriumZeile} wrap={false}>
      <Text style={styles.kriteriumId}>{k.id}</Text>
      <Text style={styles.kriteriumName}>
        {k.bezeichnung}
        {k.faktor !== 1 ? ` (×${k.faktor})` : ''}
      </Text>
      <Text style={[styles.kriteriumWert, nichtBewertet ? styles.ausgegraut : {}]}>
        {nichtBewertet
          ? 'nicht bewertet'
          : `${k.wert} – ${k.wertLabel}`}
      </Text>
      <Text style={[styles.kriteriumPunkte, nichtBewertet ? styles.ausgegraut : {}]}>
        {nichtBewertet ? '–' : k.punkte}
      </Text>
      <Text style={styles.kriteriumKommentar}>{k.kommentar || ''}</Text>
    </View>
  );
}

function PdfFooter({ erstelltAm }: { erstelltAm: string }) {
  return (
    <View style={styles.footer} fixed>
      <Text>
        Erstellt am {erstelltAm} mit dem Pflegesachverständigen-Hub · alle Daten lokal im Browser
      </Text>
      <Text
        render={({ pageNumber, totalPages }) => `Seite ${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}
