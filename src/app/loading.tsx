export default function Loading() {
  return (
    <div className="container loading-area" role="status" aria-label="Chargement de la page">
      <div className="skeleton w-2/3" />
      <div className="skeleton w-full" />
      <div className="skeleton w-full" />
    </div>
  );
}
