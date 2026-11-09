import { Component } from '@angular/core';
import { RevealDirective } from '../../services/reveal.directive';
@Component({
  selector: 'app-about',
  imports: [RevealDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {}
