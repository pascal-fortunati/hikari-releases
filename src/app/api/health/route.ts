export const dynamic = 'force-dynamic';
export function GET() {
  // Liveness must not depend on GitHub availability.
  return Response.json(
    { status: 'ok', service: 'hikari-site' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
