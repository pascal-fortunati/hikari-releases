'use client';
import { useEffect, useRef, useState } from 'react';
import { screenshots } from '@/lib/content';
import { Screenshot } from './screenshot';
import { Icon } from './icon';
import type HSOverlay from 'flyonui/dist/overlay';

const filters = ['Tout', 'Bibliothèque', 'Lecteur', 'Interface'] as const;
export function Gallery() {
  const [filter, setFilter] = useState<string>('Tout');
  const [selected, setSelected] = useState(0);
  const [ready, setReady] = useState(false);
  const overlay = useRef<HSOverlay | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const selectedRef = useRef(0);
  function select(index: number) {
    const next = (index + screenshots.length) % screenshots.length;
    selectedRef.current = next;
    setSelected(next);
  }
  useEffect(() => {
    let cancelled = false;
    const keydown = (event: KeyboardEvent) => {
      const modal = document.getElementById('gallery-modal');
      if (!modal || modal.classList.contains('hidden')) return;
      // FlyonUI 2.4.1 does not wrap Shift+Tab reliably. Keep keyboard focus
      // inside its modal for both tab directions, including after image changes.
      if (event.key === 'Tab') {
        const controls = [
          ...modal.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'),
        ].filter(
          (control) => !control.hasAttribute('disabled') && control.getClientRects().length > 0
        );
        if (!controls.length) return;
        const index = controls.indexOf(document.activeElement as HTMLElement);
        const next = event.shiftKey
          ? index <= 0
            ? controls.length - 1
            : index - 1
          : (index + 1) % controls.length;
        event.preventDefault();
        event.stopPropagation();
        controls[next].focus();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        select(selectedRef.current + 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        select(selectedRef.current - 1);
      }
    };
    void import('flyonui/dist/overlay.mjs').then(({ default: Overlay }) => {
      if (cancelled) return;
      Overlay.autoInit();
      const instance = Overlay.getInstance('#gallery-modal', true);
      if (!instance || !('element' in instance)) return;
      overlay.current = instance.element;
      // FlyonUI 2.4.1 adds the non-standard aria-overlay attribute.
      // Keep the valid dialog semantics already declared in our markup.
      overlay.current.on('open', () => {
        document.getElementById('gallery-modal')?.removeAttribute('aria-overlay');
      });
      overlay.current.on('close', () => lastTrigger.current?.focus());
      setReady(true);
    });
    document.addEventListener('keydown', keydown, true);
    return () => {
      cancelled = true;
      document.removeEventListener('keydown', keydown, true);
      overlay.current?.destroy();
      overlay.current = null;
    };
  }, []);
  const current = screenshots[selected];
  return (
    <>
      <div className="gallery-filters" role="group" aria-label="Filtrer les captures">
        {filters.map((name) => (
          <button
            key={name}
            type="button"
            className={`btn btn-sm ${filter === name ? 'btn-primary' : 'btn-outline'}`}
            aria-pressed={filter === name}
            onClick={() => setFilter(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {screenshots.filter((s) => filter === 'Tout' || s.category === filter).length} captures
        affichées
      </p>
      <div className="gallery-grid">
        {screenshots.map(
          (shot, index) =>
            (filter === 'Tout' || shot.category === filter) && (
              <article key={shot.id} data-reveal>
                <button
                  type="button"
                  className="gallery-item"
                  aria-label={`Agrandir : ${shot.title}`}
                  aria-haspopup="dialog"
                  aria-controls="gallery-modal"
                  disabled={!ready}
                  onClick={(event) => {
                    lastTrigger.current = event.currentTarget;
                    select(index);
                    void overlay.current?.open();
                  }}
                >
                  <Screenshot id={shot.id} alt={shot.alt} priority={index < 2} />
                  <div className="gallery-caption">
                    <div>
                      <span className="gallery-number">
                        CAPTURE {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2>{shot.title}</h2>
                      <p>{shot.description}</p>
                    </div>
                    <span className="gallery-open">
                      <Icon name="open_in_full" />
                      <span>Agrandir</span>
                    </span>
                  </div>
                </button>
                <span className="badge badge-soft badge-secondary">
                  {shot.category} · {shot.theme}
                </span>
              </article>
            )
        )}
      </div>
      <div
        id="gallery-modal"
        className="overlay modal modal-middle overlay-open:opacity-100 gallery-modal hidden"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
        aria-labelledby="gallery-modal-title"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h2 id="gallery-modal-title" className="modal-title">
                {current.title}
              </h2>
              <button
                type="button"
                className="btn btn-circle btn-text btn-sm"
                aria-label="Fermer la capture"
                onClick={() => void overlay.current?.close()}
              >
                <Icon name="close" />
              </button>
            </div>
            <div className="modal-body">
              <Screenshot id={current.id} alt={current.alt} priority />
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-text btn-sm"
                type="button"
                aria-label="Capture précédente"
                onClick={() => select(selected - 1)}
              >
                <Icon name="arrow_back" />
                Précédente
              </button>
              <span className="small muted" aria-live="polite">
                {selected + 1} / {screenshots.length}
              </span>
              <button
                className="btn btn-text btn-sm"
                type="button"
                aria-label="Capture suivante"
                onClick={() => select(selected + 1)}
              >
                Suivante
                <Icon name="arrow_forward" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
