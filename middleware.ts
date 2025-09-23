// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const credentials = process.env.BASIC_AUTH_CREDENTIALS || 'user:pass'
const [expectedUser, expectedPass] = credentials.split(':')

export function middleware(request: NextRequest) {
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

// ★ /physna と /physna/... だけに適用
export const config = {
  matcher: [
    '/physna', '/physna/:path*', 
// ↓ 旧 v2 (もしまだ残すなら) と新 v2 legacy の両方を保護
    '/api/physna/:path*',
    '/api/legacy/physna-v2/:path*',
// v3 UIのBASIC認証での保護
    '/physna-v3', '/physna-v3/:path*',
    '/api/physna-v3/:path*',
  ],
}
