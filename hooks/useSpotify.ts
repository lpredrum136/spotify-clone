import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
// import SpotifyWebApi from 'spotify-web-api-node'
import { ExtendedSession, TokenError } from '../types'
// import { ExtendedSession, TokenError } from '../pages/api/auth/[...nextauth]'
import { spotifyApi } from '../utils/spotify'

// TODO: Sonny does this, since we may need this instance in the client in case the one imported from /utils/spotify doesn't work
// const spotifyApi = new SpotifyWebApi({
// 	clientId: MUST_CHANGE_ENV_TO_STARTING_WITH_NEXT_PUBLIC,
// 	clientSecret: MUST_CHANGE_ENV_TO_STARTING_WITH_NEXT_PUBLIC
// })

const useSpotify = () => {
	const { data: session, status } = useSession()

	useEffect(() => {
		if (session) {
			// basically saying if refresh token fails, redirect to login
			if (
				(session as ExtendedSession).error ===
				TokenError.RefreshAccessTokenError
			) {
				signIn()
			}

			spotifyApi.setAccessToken((session as ExtendedSession).accessToken)
		}
	}, [session])

	return spotifyApi
}

export default useSpotify
