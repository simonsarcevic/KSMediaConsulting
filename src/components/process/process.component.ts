import { Component } from '@angular/core';
import { RevealDirective } from '../../services/reveal.directive';
@Component({
  selector: 'app-process',
  imports: [RevealDirective],
  templateUrl: './process.component.html',
  styleUrl: './process.component.css',
})
export class ProcessComponent {}
