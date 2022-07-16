import { User, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt'

export enum TokenError {
	RefreshAccessTokenError
}

export interface ExtendedToken extends JWT {
	accessToken: string
	refreshToken: string
	username: string
	accessTokenExpiresAt: number
	user: User
	error?: TokenError
}

export interface ExtendedSession extends Session {
	accessToken: ExtendedToken['accessToken']
	error: ExtendedToken['error']
	username: ExtendedToken['username']
}
