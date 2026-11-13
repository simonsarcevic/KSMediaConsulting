import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactDialogComponent } from './contact-dialog.component';

describe('ContactDialogComponent', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends a valid form through the native submit event', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await TestBed.configureTestingModule({
      imports: [ContactDialogComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactDialogComponent);
    fixture.detectChanges();

    const setValue = (selector: string, value: string): void => {
      const control = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      control.value = value;
      control.dispatchEvent(new Event('input'));
    };

    setValue('[name="name"]', 'Test');
    setValue('[name="email"]', 'test@example.com');
    setValue('[name="subject"]', 'Testanfrage');

    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    await fixture.whenStable();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/contact',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sends a valid form when the send button is clicked', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);

    await TestBed.configureTestingModule({ imports: [ContactDialogComponent] }).compileComponents();
    const fixture = TestBed.createComponent(ContactDialogComponent);
    fixture.detectChanges();

    const setValue = (selector: string, value: string): void => {
      const control = fixture.nativeElement.querySelector(selector) as HTMLInputElement;
      control.value = value;
      control.dispatchEvent(new Event('input'));
    };
    setValue('[name="name"]', 'Test');
    setValue('[name="email"]', 'test@example.com');
    setValue('[name="subject"]', 'Testanfrage');

    (fixture.nativeElement.querySelector('.submit') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it('explains invalid fields and connects the message for screen readers', async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDialogComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(ContactDialogComponent);
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('form') as HTMLFormElement).dispatchEvent(
      new Event('submit', { bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();

    const name = fixture.nativeElement.querySelector('#contact-name') as HTMLInputElement;
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-errormessage')).toBe('name-error');
    expect(fixture.nativeElement.querySelector('#name-error')?.textContent).toContain(
      'Bitte gib deinen Namen ein',
    );
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'markierten Felder',
    );
  });
});
