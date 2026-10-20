'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/** Animate through the browser API without changing React-owned DOM attributes. */
export function ExperienceMotion() {
  const pathname = usePathname();
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const reveals: Animation[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || preference.matches) continue;
          reveals.push(
            entry.target.animate([{ translate: '0 16px' }, { translate: '0 0' }], {
              duration: 700,
              easing: 'cubic-bezier(.16,1,.3,1)',
              composite: 'add',
            })
          );
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.08 }
    );
    const observed = new WeakSet<Element>();
    const planes: {
      element: HTMLElement;
      speed: number;
      offset: number;
      animation: Animation | null;
    }[] = [];
    let frame = 0;
    const updateDepth = () => {
      frame = 0;
      const offsets = planes.map(({ element, speed, offset }) => {
        const rect = element.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > innerHeight + 200) return null;
        return Math.max(
          -150,
          Math.min(150, (innerHeight * 0.52 - (rect.top - offset) - rect.height * 0.5) * speed)
        );
      });
      planes.forEach((plane, index) => {
        const offset = offsets[index];
        if (offset === null) return;
        if (!plane.animation) {
          plane.animation = plane.element.animate(
            [{ translate: '0 -150px' }, { translate: '0 150px' }],
            { duration: 300, fill: 'both' }
          );
          plane.animation.pause();
        }
        plane.animation.currentTime = offset + 150;
        plane.offset = offset;
      });
    };
    const scheduleDepth = () => {
      if (!preference.matches && !frame) frame = requestAnimationFrame(updateDepth);
    };
    const discover = () => {
      // App Router can commit streamed page content after the layout effect.
      // Discover that content, as well as newly filtered gallery items.
      document.querySelectorAll('[data-reveal]').forEach((element) => {
        if (observed.has(element)) return;
        observed.add(element);
        observer.observe(element);
      });
      for (let index = planes.length - 1; index >= 0; index--) {
        if (planes[index].element.isConnected) continue;
        planes[index].animation?.cancel();
        planes.splice(index, 1);
      }
      document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((element) => {
        if (planes.some((plane) => plane.element === element)) return;
        planes.push({
          element,
          speed: Number(element.dataset.parallax) || 0,
          offset: 0,
          animation: null,
        });
      });
      scheduleDepth();
    };
    const contentObserver = new MutationObserver(discover);
    const main = document.getElementById('contenu');
    if (main) contentObserver.observe(main, { childList: true, subtree: true });
    const stopDepth = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      planes.forEach((plane) => {
        plane.animation?.cancel();
        plane.animation = null;
        plane.offset = 0;
      });
      reveals.forEach((animation) => animation.cancel());
    };
    const onPreference = () => (preference.matches ? stopDepth() : scheduleDepth());
    preference.addEventListener('change', onPreference);
    window.addEventListener('scroll', scheduleDepth, { passive: true });
    window.addEventListener('resize', scheduleDepth);
    discover();
    return () => {
      observer.disconnect();
      contentObserver.disconnect();
      window.removeEventListener('scroll', scheduleDepth);
      window.removeEventListener('resize', scheduleDepth);
      preference.removeEventListener('change', onPreference);
      stopDepth();
    };
  }, [pathname]);
  return null;
}
