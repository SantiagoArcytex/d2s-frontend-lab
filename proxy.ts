import { NextRequest, NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = {
  matcher: '/((?!api|trpc|_next/static|_next/image|favicon.ico).*)',
};

export async function proxy(req: NextRequest) {
  const hostname = req.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];

  // Skip platform domains and Vercel default domains
  if (
    ['www', 'api', 'platform', 'localhost'].includes(subdomain) ||
    hostname.includes('localhost') ||
    hostname.endsWith('.vercel.app') ||
    hostname.endsWith('.vercel.sh')
  ) {
    return NextResponse.next();
  }

  // Skip if no subdomain detected (main domain)
  if (subdomain === hostname) {
    return NextResponse.next();
  }

  try {
    // Lookup in Edge Config
    const appConfig = await get(`subdomain-routing-${subdomain}`);

    if (!appConfig) {
      return new NextResponse('App not found', { status: 404 });
    }

    // Rewrite to app route
    const url = req.nextUrl.clone();
    url.pathname = `/apps/${subdomain}${url.pathname}`;
    return NextResponse.rewrite(url);
  } catch (error) {
    // If Edge Config is not available (e.g., local development), allow request to continue
    console.error('Edge Config lookup error:', error);
    return NextResponse.next();
  }
}
