import { signIn, useSession } from 'next-auth/react'
import { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node'
import { ExtendedSession, TokenError } from '../pages/api/auth/[...nextauth]'
import { spotifyApi } from '../utils/spotify'

// TODO: We may need this instance in the client in case the one imported from /utils/spotify doesn't work
// ! UPDATE: Even this doesn't work, so I'm trying https://github.com/jmperez/spotify-web-api-js (built for client)
// const spotifyApi = new SpotifyWebApi({
// 	clientId: '636650caf0f74a3d997c43dee329de89',
// 	clientSecret: '2c3b64044c7e4d14a2528111be617a81'
// })

const useSpotify = () => {
	const { data: session, status } = useSession()

	useEffect(() => {
		if (session) {
			// this is probably not necessary since the error only shows up in refreshAccessToken but we're not using it
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
