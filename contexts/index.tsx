import {
	createContext,
	Dispatch,
	ReactNode,
	SetStateAction,
	useContext,
	useState
} from 'react'

interface PlaylistContextState {
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
	selectedPlaylistId: null,
	selectedPlaylist: null
}

export const PlaylistContext = createContext<IPlaylistContext>({
	playlistContextState: defaultPlaylistContextState,
	updatePlaylistContextState: () => {}
})

export const usePlaylistContext = () => useContext(PlaylistContext)

const PlaylistContextProvider = ({ children }: { children: ReactNode }) => {
	const [playlistContextState, setPlaylistContextState] =
		useState<PlaylistContextState>(defaultPlaylistContextState)

	const updatePlaylistContextState = (
		updatedObj: Partial<PlaylistContextState>
	) => {
		setPlaylistContextState({
			...playlistContextState,
			...updatedObj
		})
	}

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
