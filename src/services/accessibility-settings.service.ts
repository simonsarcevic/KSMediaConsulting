import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type AccessibilityPreference = 'contrast' | 'text' | 'motion' | 'links';
type StoredPreference = AccessibilityPreference | 'theme';

@Injectable({ providedIn: 'root' })
export class AccessibilitySettingsService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'ks-accessibility-preferences';

  readonly highContrast = signal(false);
  readonly largeText = signal(false);
  readonly reducedMotion = signal(false);
  readonly underlinedLinks = signal(false);
  readonly darkMode = signal(false);

  constructor() {
    const saved = this.readPreferences();
    this.highContrast.set(saved.contrast === true);
    this.largeText.set(saved.text === true);
    this.reducedMotion.set(saved.motion === true);
    this.underlinedLinks.set(saved.links === true);
    this.darkMode.set(
      saved.theme ??
        (typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches),
    );

    effect(() => {
      const preferences = {
        contrast: this.highContrast(),
        text: this.largeText(),
        motion: this.reducedMotion(),
        links: this.underlinedLinks(),
        theme: this.darkMode(),
      };
      const root = this.document.documentElement;
      root.toggleAttribute('data-a11y-contrast', preferences.contrast);
      root.toggleAttribute('data-a11y-text', preferences.text);
      root.toggleAttribute('data-a11y-motion', preferences.motion);
      root.toggleAttribute('data-a11y-links', preferences.links);
      root.dataset['theme'] = preferences.theme ? 'dark' : 'light';
      root.style.colorScheme = preferences.theme ? 'dark' : 'light';

      try {
        localStorage.setItem(this.storageKey, JSON.stringify(preferences));
      } catch {
        // The settings still work for the current page if storage is unavailable.
      }
    });
  }

  toggleDarkMode(): void {
    this.darkMode.update((dark) => !dark);
  }

  set(preference: AccessibilityPreference, enabled: boolean): void {
    const target = {
      contrast: this.highContrast,
      text: this.largeText,
      motion: this.reducedMotion,
      links: this.underlinedLinks,
    }[preference];
    target.set(enabled);
  }

  reset(): void {
    this.highContrast.set(false);
    this.largeText.set(false);
    this.reducedMotion.set(false);
    this.underlinedLinks.set(false);
  }

  private readPreferences(): Partial<Record<StoredPreference, boolean>> {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '{}');
    } catch {
      return {};
    }
  }
}
