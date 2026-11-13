import { Component, inject } from '@angular/core';
import {
  AccessibilityPreference,
  AccessibilitySettingsService,
} from '../../services/accessibility-settings.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
  protected readonly settings = inject(AccessibilitySettingsService);

  protected update(preference: AccessibilityPreference, event: Event): void {
    this.settings.set(preference, (event.target as HTMLInputElement).checked);
  }
}
