import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AccessibilityPreference,
  AccessibilitySettingsService,
} from '../../services/accessibility-settings.service';
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
  protected readonly settings = inject(AccessibilitySettingsService);
  protected readonly settingsOpen = signal(false);

  protected toggleSettings(): void {
    this.settingsOpen.update((open) => !open);
  }

  protected update(preference: AccessibilityPreference, event: Event): void {
    this.settings.set(preference, (event.target as HTMLInputElement).checked);
  }
}
