import { Component, output } from '@angular/core';
import { RevealDirective } from '../../services/reveal.directive';
@Component({
  selector: 'app-contact',
  imports: [RevealDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  readonly contactClick = output<void>();
}
