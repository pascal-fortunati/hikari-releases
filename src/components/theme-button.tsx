'use client';
import { Icon } from './icon';

export function ThemeButton() {
  return (
    <button
      type="button"
      className="btn btn-circle btn-text theme-toggle"
      aria-label="Changer de thème"
      title="Changer de thème"
      onClick={() => {
        const theme =
          document.documentElement.dataset.theme === 'hikari-dark' ? 'hikari-light' : 'hikari-dark';
        document.documentElement.dataset.theme = theme;
        try {
          localStorage.setItem('hikari-theme', theme);
        } catch {
          /* Theme still works without storage. */
        }
      }}
    >
      <span className="when-dark">
        <Icon name="light_mode" />
      </span>
      <span className="when-light">
        <Icon name="dark_mode" />
      </span>
    </button>
  );
}
