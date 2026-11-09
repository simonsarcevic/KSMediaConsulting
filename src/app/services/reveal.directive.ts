import { afterNextRender, Directive, ElementRef, OnDestroy } from '@angular/core';
@Directive({ selector: '[appReveal]', host: { class: 'reveal' } })
export class RevealDirective implements OnDestroy {
  private observer?: IntersectionObserver;
  constructor(private readonly element: ElementRef<HTMLElement>) {
    afterNextRender(() => {
      if (typeof matchMedia !== 'function' || typeof IntersectionObserver === 'undefined' || matchMedia('(prefers-reduced-motion: reduce)').matches) { this.element.nativeElement.classList.add('is-visible'); return; }
      this.observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); this.observer?.disconnect(); }
      }, { threshold: 0.14 });
      this.observer.observe(this.element.nativeElement);
    });
  }
  ngOnDestroy(): void { this.observer?.disconnect(); }
}
