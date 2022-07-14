// ! This (https://next-auth.js.org/configuration/nextjs#basic-usage) doesn't seem to work,
// so I upgraded Next to 12.2 (stable middleware)
// https://nextjs.org/docs/messages/middleware-upgrade-guide
// and followed https://nextjs.org/docs/advanced-features/middleware to write my own

// pages/_middleware.ts
// export { default } from 'next-auth/middleware'
// export const config = { matcher: ['/dashboard'] }

// * My implementation

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export const middleware = async (request: NextRequest) => {
	// If user is logged in, token will exist
	const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET
	})

	// Allow the request if (1) token exists OR (2) it's a request for next-auth session & provider fetching
	const { pathname } = request.nextUrl
	console.log('requesting pathname: ', pathname)

	// really strange that we need that '/_next' check, best bet is that Next.js load source files for Login page from there
	// to be exact, from /_next/static/, just look at the log and you'll see
	if (token || pathname.includes('/api/auth') || pathname.includes('/_next')) {
		console.log('request allowed!')
		return NextResponse.next()
	}

	// Redirect to login if user doesn't have a token AND is requesting protected route
	if (!token && pathname !== '/login') {
		console.log('request denied, redirecting to login...')
		return NextResponse.redirect(new URL('/login', request.url))
	}

	// TODO: Redirect to home page if user has a token AND is requesting /login

	// return NextResponse.next()
}

// See "Matching Paths" below (go to Next doc) to learn more
// export const config = {
// 	matcher: '/about/:path*'
// }
