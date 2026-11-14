import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('toggles dark mode from the navigation and exposes its state', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.theme-toggle') as HTMLButtonElement;
    const initialState = toggle.getAttribute('aria-pressed') === 'true';

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-pressed')).toBe(String(!initialState));
    expect(document.documentElement.dataset['theme']).toBe(initialState ? 'light' : 'dark');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Digital, aber');
    expect(compiled.querySelector('.hero-visual')).toBeTruthy();
  });

  it('provides a skip link and optional accessibility settings', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.skip-link')?.getAttribute('href')).toBe('#main-content');
    expect(compiled.querySelector('main')?.id).toBe('main-content');
    expect(
      compiled.querySelectorAll('.accessibility-settings input[type="checkbox"]'),
    ).toHaveLength(4);

    const toggle = compiled.querySelector('.settings-toggle') as HTMLButtonElement;
    const panel = compiled.querySelector('#accessibility-settings-panel') as HTMLElement;
    const clip = compiled.querySelector('.settings-clip') as HTMLElement;
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(panel.getAttribute('aria-hidden')).toBe('true');
    expect(clip.hasAttribute('inert')).toBe(true);
    toggle.click();
    fixture.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(panel.getAttribute('aria-hidden')).toBe('false');
    expect(clip.hasAttribute('inert')).toBe(false);
  });
});
