type WaveVariant = 'hero' | 'footer';

/** A moving ribbon drawn in code, from Hikari's blue and apricot palette. */
export function AmbientWaves({ variant = 'hero' }: { variant?: WaveVariant }) {
  return (
    <div className={`ambient-waves ambient-waves-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1800 600" preserveAspectRatio="none" focusable="false">
        <g className="wave-layer wave-layer-back">
          <path d="M-200 310C110 110 290 510 640 310S1160 80 1500 270S1900 410 2050 220V650H-200Z" />
        </g>
        <g className="wave-layer wave-layer-warm">
          <path d="M-200 470C130 190 390 520 740 340S1250 200 1530 390S1920 420 2050 310V650H-200Z" />
        </g>
        <g className="wave-layer wave-layer-front">
          <path d="M-200 440C180 530 300 250 680 410S1230 560 1510 370S1920 250 2050 440V650H-200Z" />
        </g>
      </svg>
    </div>
  );
}
