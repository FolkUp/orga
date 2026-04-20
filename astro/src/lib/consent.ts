/**
 * ORGA consent contract — shared by CookieConsent banner and any embed component
 * that must stay inert until the user opts in.
 *
 * Scope: orga.folkup.app origin only. localStorage does not cross subdomains.
 */

export const CONSENT_STORAGE_KEY = 'orga-consent-v1';
export const CONSENT_EVENT_NAME = 'orga-consent-changed';

export interface ConsentState {
  embeds: boolean;
  timestamp: string;
  version: 1;
}

export const DEFAULT_DENIED: ConsentState = {
  embeds: false,
  timestamp: '',
  version: 1,
};

function hasStorage(): boolean {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window;
  } catch {
    return false;
  }
}

export function readConsent(): ConsentState | null {
  if (!hasStorage()) return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeConsent(partial: Partial<Omit<ConsentState, 'version' | 'timestamp'>>): ConsentState {
  const previous = readConsent() ?? DEFAULT_DENIED;
  const next: ConsentState = {
    ...previous,
    ...partial,
    timestamp: new Date().toISOString(),
    version: 1,
  };
  if (hasStorage()) {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT_NAME, { detail: next }));
  }
  return next;
}

export function clearConsent(): void {
  if (hasStorage()) {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT_NAME, { detail: DEFAULT_DENIED }));
  }
}

export function onConsentChange(callback: (state: ConsentState) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<ConsentState>).detail;
    if (detail) callback(detail);
  };
  window.addEventListener(CONSENT_EVENT_NAME, handler);
  return () => window.removeEventListener(CONSENT_EVENT_NAME, handler);
}

export function hasEmbedsConsent(): boolean {
  return readConsent()?.embeds === true;
}
