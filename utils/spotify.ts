// copy from https://github.com/thelinmichael/spotify-web-api-node

import SpotifyWebApi from 'spotify-web-api-node'

const scopes = [
	'user-read-email',
	'user-read-private',
	'user-library-read',
	'user-top-read',
	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'user-read-recently-played',
	'user-follow-read',
	'playlist-read-private',
	'playlist-read-collaborative',
	'streaming'
].join(',')

const params = { scope: scopes }

const queryParams = new URLSearchParams(params)

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParams.toString()}`

const spotifyApi = new SpotifyWebApi({
	clientId: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET
	// don't need this
	// redirectUri: 'http://www.example.com/callback'
})

// * THIS IS FROM spotify-web-api-node, SONNY doesn't use this
// Create the authorization URL
// 			const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state)
// https://accounts.spotify.com:443/authorize?client_id=5fe01282e44241328a84e7c5cc169165&response_type=code&redirect_uri=https://example.com/callback&scope=user-read-private%20user-read-email&state=some-state-of-my-choice
// 			console.log(authorizeURL)

// * THIS IS MY CODE: the authorize URL:
// https://accounts.spotify.com/en/authorize?client_id=636650caf0f74a3d997c43dee329de89&scope=user-read-email%2Cuser-read-private%2Cuser-library-read%2Cuser-top-read%2Cuser-read-playback-state%2Cuser-modify-playback-state%2Cuser-read-currently-playing%2Cuser-read-recently-played%2Cuser-follow-read%2Cplaylist-read-private%2Cplaylist-read-collaborative%2Cstreaming&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fspotify&state=f2DEXT6w2Ru4Hr_H9sk0D7-PsuD2v67lTHqCjW4FFqk

export { spotifyApi, LOGIN_URL, scopes }
