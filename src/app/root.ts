import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccessibilitySettingsService } from '../services/accessibility-settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class RootComponent {
  private readonly accessibilitySettings = inject(AccessibilitySettingsService);
}
