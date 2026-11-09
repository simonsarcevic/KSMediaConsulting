import { Component } from '@angular/core';
import { AGENCY_SERVICES } from '../../services/services.data';
import { RevealDirective } from '../../services/reveal.directive';
@Component({ selector: 'app-services', imports: [RevealDirective], templateUrl: './services.component.html', styleUrl: './services.component.css' })
export class ServicesComponent { protected readonly services = AGENCY_SERVICES; }
