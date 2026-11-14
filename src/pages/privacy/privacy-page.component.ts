import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';
import { AccessibilitySettingsService } from '../../services/accessibility-settings.service';

@Component({
  selector: 'app-privacy-page',
  imports: [RouterLink, FooterComponent],
  templateUrl: './privacy-page.component.html',
  styleUrl: './privacy-page.component.css',
})
export class PrivacyPageComponent {
  protected readonly settings = inject(AccessibilitySettingsService);
}
