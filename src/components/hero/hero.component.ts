import { Component, output } from '@angular/core';
import { RevealDirective } from '../../services/reveal.directive';
@Component({ selector: 'app-hero', imports: [RevealDirective], templateUrl: './hero.component.html', styleUrl: './hero.component.css' })
export class HeroComponent { readonly contactClick = output<void>(); }
