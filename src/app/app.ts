import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { HeroComponent } from '../components/hero/hero.component';
import { ServicesComponent } from '../components/services/services.component';
import { AboutComponent } from '../components/about/about.component';
import { ProcessComponent } from '../components/process/process.component';
import { ContactComponent } from '../components/contact/contact.component';
import { FooterComponent } from '../components/footer/footer.component';
import { ContactDialogComponent } from '../dialogs/contact-dialog/contact-dialog.component';
import { AccessibilitySettingsService } from '../services/accessibility-settings.service';

@Component({
  imports: [
    HeaderComponent,
    HeroComponent,
    ServicesComponent,
    AboutComponent,
    ProcessComponent,
    ContactComponent,
    FooterComponent,
    ContactDialogComponent,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly accessibilitySettings = inject(AccessibilitySettingsService);
  protected readonly contactOpen = signal(false);
}
