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
  protected readonly visible = signal(false);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const element = this.dialog()?.nativeElement;
      if (!element) return;
      if (this.open() && !element.open) {
        this.visible.set(false);
        element.showModal();
        requestAnimationFrame(() => {
          if (this.open()) this.visible.set(true);
        });
      }
      if (!this.open() && element.open && !this.closing()) {
        this.visible.set(false);
        element.close();
      }
    });
  }

  protected close(): void {
    if (this.closing()) return;
    this.closing.set(true);
    this.visible.set(false);
    const reduceMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => {
      this.dialog()?.nativeElement.close();
      this.sent.set(false);
      this.closing.set(false);
      this.closed.emit();
    }, reduceMotion ? 0 : 210);
  }

  protected submit(): void {
    this.sent.set(true);
  }
}
