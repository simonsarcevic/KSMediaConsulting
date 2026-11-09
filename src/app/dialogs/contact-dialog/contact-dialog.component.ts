import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({ selector: 'app-contact-dialog', imports: [FormsModule], templateUrl: './contact-dialog.component.html', styleUrl: './contact-dialog.component.css' })
export class ContactDialogComponent {
  readonly open = input(false); readonly closed = output<void>(); protected readonly sent = signal(false); private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  constructor() { effect(() => { const el = this.dialog()?.nativeElement; if (!el) return; if (this.open() && !el.open) el.showModal(); else if (!this.open() && el.open) el.close(); }); }
  protected close(): void { this.sent.set(false); this.closed.emit(); }
  protected submit(): void { this.sent.set(true); }
}
