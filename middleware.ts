import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {resolveBrand} from './src/brand/resolve';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  const pathname = req.nextUrl.pathname;
  const tenant = req.cookies.get('ENVNEO_TENANT')?.value ?? null;

  const {brand_id} = resolveBrand({host, pathname, tenant});

  const res = NextResponse.next();
  res.cookies.set('ENVNEO_BRAND', brand_id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  return res;
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)']
};
