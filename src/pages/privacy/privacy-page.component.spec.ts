import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PrivacyPageComponent } from './privacy-page.component';

describe('PrivacyPageComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');

    await TestBed.configureTestingModule({
      imports: [PrivacyPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders an accessible privacy statement', async () => {
    const fixture = TestBed.createComponent(PrivacyPageComponent);
    await fixture.whenStable();
    fixture.detectChanges();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelectorAll('h1')).toHaveLength(1);
    expect(page.querySelector('h1')?.textContent).toContain('Datenschutzerklärung');
    expect(page.querySelector('main')?.id).toBe('main-content');
    expect(page.querySelector('a[href^="mailto:"]')).toBeTruthy();
  });
});
