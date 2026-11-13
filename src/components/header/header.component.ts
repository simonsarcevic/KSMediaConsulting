import { Component, HostListener, output, signal } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  readonly contactClick = output<void>();
  protected readonly menuOpen = signal(false);
  protected readonly compact = signal(false);
  @HostListener('window:scroll') onScroll(): void {
    this.compact.set(window.scrollY > 24);
  }
  @HostListener('document:keydown.escape') onEscape(): void {
    this.closeMenu();
  }
  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }
  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
