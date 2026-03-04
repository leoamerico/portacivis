import {NextRequest, NextResponse} from 'next/server';

export const runtime = 'nodejs';

const TILE_SERVER = 'https://tile.openstreetmap.org';

function parseTileParam(value: string | undefined, fallback: number) {
  const parsed = Number(value ?? '');
  return Number.isInteger(parsed) ? parsed : fallback;
}

function isValidRange(z: number, x: number, y: number) {
  if (z < 0 || z > 19) {
    return false;
  }

  const max = 2 ** z;
  return x >= 0 && y >= 0 && x < max && y < max;
}

export async function GET(
  _request: NextRequest,
  {params}: {params: Promise<{z: string; x: string; y: string}>}
) {
  const resolved = await params;
  const z = parseTileParam(resolved.z, -1);
  const x = parseTileParam(resolved.x, -1);
  const y = parseTileParam((resolved.y ?? '').replace('.png', ''), -1);

  if (!isValidRange(z, x, y)) {
    return NextResponse.json({success: false, error: 'Invalid tile coordinates'}, {status: 400});
  }

  const upstreamUrl = `${TILE_SERVER}/${z}/${x}/${y}.png`;
  const upstream = await fetch(upstreamUrl, {
    headers: {
      'user-agent': 'PortaCivis/1.0 (+https://www.portacivis.com.br)'
    },
    next: {revalidate: 60 * 60 * 24}
  });

  if (!upstream.ok) {
    return NextResponse.json(
      {success: false, error: 'Tile upstream unavailable'},
      {status: upstream.status}
    );
  }

  const contentType = upstream.headers.get('content-type') ?? 'image/png';
  const data = await upstream.arrayBuffer();

  return new Response(data, {
    status: 200,
    headers: {
      'content-type': contentType,
      'cache-control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
    }
  });
}
