import NextAuth, { CallbacksOptions, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import SpotifyProvider from 'next-auth/providers/spotify'
import { LOGIN_URL, scopes, spotifyApi } from '../../../utils/spotify'

// * THIS WHOLE FILE IS SERVER SIDE
export enum TokenError {
	RefreshAccessTokenError
}

interface ExtendedToken extends JWT {
	accessToken: string
	refreshToken: string
	username: string
	accessTokenExpiresAt: number
	user: User
	// this is probably not necessary since the error only shows up in refreshAccessToken but we're not using it
	error?: TokenError
}

export interface ExtendedSession extends Session {
	accessToken: ExtendedToken['accessToken']
	// this is probably not necessary since the error only shows up in refreshAccessToken but we're not using it
	error: ExtendedToken['error']
	username: ExtendedToken['username']
}

const refreshAccessToken = async (
	token: ExtendedToken
): Promise<ExtendedToken> => {
	try {
		spotifyApi.setAccessToken(token.accessToken)
		spotifyApi.setRefreshToken(token.refreshToken)

		// Since we've set the above 2 values, we are saying "hey Spotify, refresh these two dead tokens!"
		// Spotify will use refreshToken (never expires) to bring accessToken back to life
		const { body: refreshedTokens } = await spotifyApi.refreshAccessToken()

		console.log('REFRESHED TOKENS ARE', refreshedTokens)

		return {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000, // spotify api will return 3600
			refreshToken: refreshedTokens.refresh_token || token.refreshToken // Fall back to old refresh token
		}
	} catch (error) {
		console.error(error)
		return {
			...token,
			error: TokenError.RefreshAccessTokenError
		}
	}
}

const jwtCallback: CallbacksOptions['jwt'] = async ({
	token,
	account,
	user
}) => {
	// ! TODO: THE FOLLOWING IS FROM SONNY, BUT BASED ON next-auth-example repo, it seems NextAuth
	// largely based on https://next-auth.js.org/tutorials/refresh-token-rotation
	// v4 already have native refresh token feature, so probably we don't need this

	// * START CODE PART BY SONNY

	let extendedToken: ExtendedToken

	// If user sign in for the first time, on a new session, add more stuff on the token
	// Where do you get this?
	// https://next-auth.js.org/tutorials/refresh-token-rotation#server-side
	if (account && user) {
		extendedToken = {
			...token,
			user,
			accessToken: account.access_token as string,
			refreshToken: account.refresh_token as string,
			username: account.providerAccountId,
			accessTokenExpiresAt: (account.expires_at as number) * 1000 // convert to ms to be easier to check
		}

		console.log('FIRST TIME LOGIN, EXTENDED TOKEN', extendedToken)

		return extendedToken
	}

	// Subsequent time: token is now already extended with those properties
	// Return previous token if the access token has not expired
	// if (Date.now() < (token as ExtendedToken).accessTokenExpiresAt) {
	// 	console.log('access token is still valid')
	// 	return token
	// }

	// if access token has expired, refresh it
	// console.log('access token has expired, refreshing...')
	// return await refreshAccessToken(token as ExtendedToken)

	// * END CODE PART BY SONNY

	// * START MY CODE, I think we don't need to check if token has expired, since NextAuth seems to do this automatically
	console.log('SUBSEQUENT LOGIN, TOKEN', token)
	return token
	// * END MY CODE
}

// Next step after jwtCallback, typically used for sending things to client in NextAuth session object
// By default, only a subset of the JWT token is sent to client due to security
// retrieved via useSession() or getSession()
// https://next-auth.js.org/getting-started/example#extensibility
// https://next-auth.js.org/getting-started/client#usesession
// https://next-auth.js.org/getting-started/client#getsession
// https://next-auth.js.org/configuration/callbacks#session-callback
// In this case, token will be truthy, user will be falsy
// since we're not using database sessions. We're just using JWT for sessions.
const sessionCallback: CallbacksOptions['session'] = async ({
	session,
	token,
	user
}) => {
	session.user = (token as ExtendedToken).user
	session.accessToken = (token as ExtendedToken).accessToken
	// this is probably not necessary since the error only shows up in refreshAccessToken but we're not using it
	session.error = (token as ExtendedToken).error
	session.username = (token as ExtendedToken).username

	return session
}

export default NextAuth({
	// Configure one or more authentication providers
	providers: [
		SpotifyProvider({
			clientId: process.env.SPOTIFY_CLIENT_ID as string,
			clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
			// Sonny does this LOGIN_URL string but let's try object
			// authorization: LOGIN_URL

			// I do this
			authorization: {
				url: 'https://accounts.spotify.com/authorize',
				params: {
					scope: scopes
				}
			}
		})
		// ...add more providers here
	],
	// Sonny does this
	// but NextAuth doc doesn't need it anymore, since we have NEXTAUTH_SECRET env var already
	// https://next-auth.js.org/configuration/options
	// secret: process.env.NEXTAUTH_SECRET,

	// custom signin page to override default NextAuth unbranded sign in page
	// https://next-auth.js.org/configuration/pages
	pages: {
		signIn: '/login'
	},
	callbacks: {
		jwt: jwtCallback,
		session: sessionCallback
	}
})
