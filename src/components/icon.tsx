export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <span aria-hidden="true" className={`material-icons-round ${className}`}>
      {name}
    </span>
  );
}
