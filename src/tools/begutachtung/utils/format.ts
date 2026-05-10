import type { Begutachtung } from '../state/schema';

export function formatDateTime(iso: string): string {
  if (!iso) return '–';
  try {
    return new Date(iso).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function formatDate(iso: string): string {
  if (!iso) return '–';
  try {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function bezeichnungFuer(begutachtung: Begutachtung): string {
  const name = begutachtung.stammdaten.person.name.trim();
  if (name) return name;
  return 'Unbenannte Begutachtung';
}

export function downloadDateinameFuer(begutachtung: Begutachtung): string {
  const name = bezeichnungFuer(begutachtung)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const datum = begutachtung.stammdaten.termin.datum || begutachtung.createdAt.slice(0, 10);
  return `begutachtung-${name || 'unbenannt'}-${datum}.json`;
}
