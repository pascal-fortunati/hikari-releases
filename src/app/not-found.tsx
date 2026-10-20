import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="container error-page">
      <p className="eyebrow">ERREUR 404</p>
      <h1>Cette page n’existe pas.</h1>
      <Link className="btn btn-primary" href="/">
        Retrouver l’accueil
      </Link>
    </div>
  );
}
