import { useSession } from 'next-auth/react'
import {
	createContext,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState
} from 'react'
import useSpotify from '../hooks/useSpotify'

interface SongContextState {
	selectedSongId: string | null
	selectedSong: SpotifyApi.TrackObjectFull | null
	isPlaying: boolean
}

interface ISongContext {
	songContextState: SongContextState
	updateSongContextState: (updatedObj: Partial<SongContextState>) => void
}

const defaultSongContextState: ISongContext['songContextState'] = {
	selectedSongId: null,
	selectedSong: null,
	isPlaying: false
}

export const SongContext = createContext<ISongContext>({
	songContextState: defaultSongContextState,
	updateSongContextState: () => {}
})

export const useSongContext = () => useContext(SongContext)

const SongContextProvider = ({ children }: { children: ReactNode }) => {
	const spotifyApi = useSpotify()

	const { data: session } = useSession()

	const [songContextState, setSongContextState] = useState<SongContextState>(
		defaultSongContextState
	)

	const updateSongContextState = useCallback(
		(updatedObj: Partial<SongContextState>) => {
			setSongContextState(previousSongContextState => ({
				...previousSongContextState,
				...updatedObj
			}))
		},
		[]
	)

	useEffect(() => {
		const getCurrentPlayingSong = async () => {
			const songInfo = await spotifyApi.getMyCurrentPlayingTrack()

			if (songInfo.body) {
				updateSongContextState({
					selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull
				})
			}
		}

		if (spotifyApi.getAccessToken() && !songContextState.selectedSongId) {
			getCurrentPlayingSong()
		}
	}, [
		songContextState.selectedSongId,
		spotifyApi,
		updateSongContextState,
		session
	])

	const songContextProviderData = {
		songContextState,
		updateSongContextState
	}

	return (
		<SongContext.Provider value={songContextProviderData}>
			{children}
		</SongContext.Provider>
	)
}

export default SongContextProvider
