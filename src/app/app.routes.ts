import { Routes } from '@angular/router';
import { App } from './app';
import { PrivacyPageComponent } from '../pages/privacy/privacy-page.component';

export const routes: Routes = [
  { path: '', component: App, title: 'KS Media Consulting – Webentwicklung & Social Media' },
  {
    path: 'datenschutz',
    component: PrivacyPageComponent,
    title: 'Datenschutz – KS Media Consulting',
  },
  { path: '**', redirectTo: '' },
];
