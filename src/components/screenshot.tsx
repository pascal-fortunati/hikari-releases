import Image from 'next/image';

export function Screenshot({
  id,
  alt,
  priority = false,
  className = '',
}: {
  id: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`screenshot ${className}`}>
      <Image
        src={`/screenshots/${id}.webp`}
        alt={alt}
        width={1460}
        height={930}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        sizes="(max-width: 720px) 94vw, (max-width: 1100px) 90vw, 1180px"
      />
    </div>
  );
}
