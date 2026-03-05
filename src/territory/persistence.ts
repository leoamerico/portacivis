import type {SavedSelection} from './types';

const STORAGE_KEY = 'portacivis_territory';

export function readSavedSelection(): SavedSelection | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedSelection) : null;
  } catch {
    return null;
  }
}

export function persistSelection(payload: Record<string, unknown>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}
