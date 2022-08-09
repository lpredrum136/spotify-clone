import { useSession } from 'next-auth/react'
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from 'react'
import useSpotify from '../hooks/useSpotify'

interface PlaylistContextState {
	playlists: SpotifyApi.PlaylistObjectSimplified[]
	selectedPlaylistId: string | null
	selectedPlaylist: SpotifyApi.SinglePlaylistResponse | null
}

interface IPlaylistContext {
	playlistContextState: PlaylistContextState
	updatePlaylistContextState: (
		updatedObj: Partial<PlaylistContextState>
	) => void
}

const defaultPlaylistContextState: IPlaylistContext['playlistContextState'] = {
	playlists: [],
	selectedPlaylistId: null,
	selectedPlaylist: null
}

export const PlaylistContext = createContext<IPlaylistContext>({
	playlistContextState: defaultPlaylistContextState,
	updatePlaylistContextState: () => {}
})

export const usePlaylistContext = () => useContext(PlaylistContext)

const PlaylistContextProvider = ({ children }: { children: ReactNode }) => {
	const spotifyApi = useSpotify()

	const { data: session } = useSession()

	// If this console log returns null, it means we are not logged in
	// if it's undefined, session has not been fetched yet
	// https://next-auth.js.org/getting-started/client#usesession

	// console.log('SESSION', session)

	const [playlistContextState, setPlaylistContextState] =
		useState<PlaylistContextState>(defaultPlaylistContextState)

	const updatePlaylistContextState = (
		updatedObj: Partial<PlaylistContextState>
	) => {
		setPlaylistContextState(previousPlaylistContextState => ({
			...previousPlaylistContextState,
			...updatedObj
		}))
	}

	useEffect(() => {
		const getUserPlaylists = async () => {
			const userPlaylistsResponse = await spotifyApi.getUserPlaylists()
			updatePlaylistContextState({
				playlists: userPlaylistsResponse.body.items
			})
		}

		if (spotifyApi.getAccessToken()) {
			getUserPlaylists()
		}
	}, [spotifyApi, session])

	const playlistContextProviderData = {
		playlistContextState,
		updatePlaylistContextState
	}

	return (
		<PlaylistContext.Provider value={playlistContextProviderData}>
			{children}
		</PlaylistContext.Provider>
	)
}

export default PlaylistContextProvider
