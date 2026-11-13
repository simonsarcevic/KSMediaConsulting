import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-dialog.component.html',
  styleUrl: './contact-dialog.component.css',
})
export class ContactDialogComponent {
  readonly open = input(false);
  readonly closed = output<void>();
  protected readonly sent = signal(false);
  protected readonly sending = signal(false);
  protected readonly sendError = signal('');
  protected readonly closing = signal(false);
  protected readonly visible = signal(false);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly formGroup = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(120)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(4000)],
    }),
    website: new FormControl('', { nonNullable: true }),
  });

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
    const reduceMotion =
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(
      () => {
        this.dialog()?.nativeElement.close();
        this.sent.set(false);
        this.sending.set(false);
        this.sendError.set('');
        this.formGroup.reset();
        this.closing.set(false);
        this.closed.emit();
      },
      reduceMotion ? 0 : 210,
    );
  }

  protected async submit(): Promise<void> {
    if (this.formGroup.invalid || this.sending()) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.sendError.set('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(this.formGroup.getRawValue()),
      });

      if (!response.ok) {
        throw new Error(`Contact request failed with status ${response.status}`);
      }

      this.sent.set(true);
    } catch {
      this.sendError.set(
        'Die Anfrage konnte gerade nicht versendet werden. Bitte versuche es gleich noch einmal.',
      );
    } finally {
      this.sending.set(false);
    }
  }
}
