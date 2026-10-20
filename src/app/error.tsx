'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container error-page">
      <h1>La page n’a pas pu se charger.</h1>
      <p>La page n’a pas pu s’afficher. Vous pouvez réessayer.</p>
      <button type="button" className="btn btn-primary" onClick={reset}>
        Réessayer
      </button>
    </div>
  );
}
