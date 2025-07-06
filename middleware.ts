// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const credentials = process.env.BASIC_AUTH_CREDENTIALS || 'user:pass'
const [expectedUser, expectedPass] = credentials.split(':')

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const pathname = url.pathname

  // 認証をスキップするパス
  const publicPaths = [
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/api',
    '/_next',
    '/assets',
  ]
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const base64 = authHeader.split(' ')[1]
    const [user, pass] = Buffer.from(base64, 'base64').toString().split(':')

    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: ['/:path*'],
}
