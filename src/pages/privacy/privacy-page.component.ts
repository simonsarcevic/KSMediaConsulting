import { DOCUMENT } from '@angular/common';
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
  private readonly document = inject(DOCUMENT);
  protected readonly settings = inject(AccessibilitySettingsService);

  protected scrollToSection(event: Event, sectionId: string): void {
    event.preventDefault();
    const target = this.document.getElementById(sectionId);
    if (!target) return;

    target.scrollIntoView({
      behavior: this.settings.reducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
    target.focus({ preventScroll: true });
    this.document.defaultView?.history.replaceState(null, '', `#${sectionId}`);
  }
}
