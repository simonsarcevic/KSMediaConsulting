import { afterNextRender, Directive, ElementRef, OnDestroy } from '@angular/core';
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class RevealDirective implements OnDestroy {
  private observer?: IntersectionObserver;
  private lastScrollY = 0;
  private scrollingUp = false;
  private readonly handleScroll = (): void => {
    const currentScrollY = window.scrollY;
    this.scrollingUp = currentScrollY < this.lastScrollY;
    this.lastScrollY = currentScrollY;
  };

  constructor(private readonly element: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (
        typeof matchMedia !== 'function' ||
        typeof IntersectionObserver === 'undefined' ||
        matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        this.element.nativeElement.classList.add('is-visible');
        return;
      }

      this.lastScrollY = window.scrollY;
      window.addEventListener('scroll', this.handleScroll, { passive: true });
      this.observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else if (this.scrollingUp && entry.boundingClientRect.top > 0) {
            entry.target.classList.remove('is-visible');
          }
        },
        { threshold: 0.14 },
      );
      this.observer.observe(this.element.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (typeof window !== 'undefined') window.removeEventListener('scroll', this.handleScroll);
  }
}
