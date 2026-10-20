'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function Flyon() {
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    const instances: { destroy(): void }[] = [];
    const menu = document.getElementById('mobile-menu');
    const toggle = document.querySelector<HTMLElement>('[data-collapse="#mobile-menu"]');
    const resetMenu = () => {
      menu?.classList.remove('open');
      menu?.classList.add('hidden');
      menu?.style.removeProperty('height');
      toggle?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    };
    resetMenu();
    const onMenuLink = (event: Event) => {
      if ((event.target as HTMLElement).closest('a')) resetMenu();
    };
    menu?.addEventListener('click', onMenuLink);
    void (async () => {
      // Import only used JS plugins, in the browser after route commit.
      const [{ default: Accordion }, { default: Collapse }, { default: Tabs }] = await Promise.all([
        import('flyonui/dist/accordion.mjs'),
        import('flyonui/dist/collapse.mjs'),
        import('flyonui/dist/tabs.mjs'),
      ]);
      if (cancelled) return;
      // autoInit also creates the global collections required by constructors.
      Accordion.autoInit();
      Collapse.autoInit();
      Tabs.autoInit();
      document.querySelectorAll<HTMLElement>('.accordion-item').forEach((el) => {
        const item = Accordion.getInstance(el, true);
        if (item && 'element' in item) instances.push(item.element);
      });
      document.querySelectorAll<HTMLElement>('[data-collapse]').forEach((el) => {
        const item = Collapse.getInstance(el, true);
        if (item && 'element' in item) instances.push(item.element);
      });
      document.querySelectorAll<HTMLElement>('[role="tablist"]').forEach((el) => {
        const item = Tabs.getInstance(el, true);
        if (item && 'element' in item) instances.push(item.element);
      });
      document.documentElement.dataset.flyonReady = 'true';
    })();
    return () => {
      cancelled = true;
      delete document.documentElement.dataset.flyonReady;
      menu?.removeEventListener('click', onMenuLink);
      resetMenu();
      instances.forEach((instance) => instance.destroy());
    };
  }, [pathname]);
  return null;
}
