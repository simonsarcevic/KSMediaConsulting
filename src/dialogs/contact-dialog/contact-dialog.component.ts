import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-dialog',
  imports: [FormsModule],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.css',
})
export class ContactDialogComponent {
  readonly open = input(false);
  readonly closed = output<void>();
  protected readonly sent = signal(false);
  protected readonly closing = signal(false);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private closeTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const element = this.dialog()?.nativeElement;
      if (!element) return;
      if (this.open() && !element.open) element.showModal();
      if (!this.open() && element.open && !this.closing()) element.close();
    });
  }

  protected close(): void {
    if (this.closing()) return;
    this.closing.set(true);
    const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.closeTimer = setTimeout(() => {
      this.dialog()?.nativeElement.close();
      this.sent.set(false);
      this.closing.set(false);
      this.closed.emit();
    }, reduceMotion ? 0 : 260);
  }

  protected submit(): void {
    this.sent.set(true);
  }
}
