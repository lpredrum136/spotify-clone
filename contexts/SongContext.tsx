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
	volume: number
	deviceId: string | null
}

interface ISongContext {
	songContextState: SongContextState
	updateSongContextState: (updatedObj: Partial<SongContextState>) => void
}

export const defaultSongContextState: ISongContext['songContextState'] = {
	selectedSongId: null,
	selectedSong: null,
	isPlaying: false,
	volume: 50,
	deviceId: null
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

	const updateSongContextState = (updatedObj: Partial<SongContextState>) => {
		setSongContextState(previousSongContextState => ({
			...previousSongContextState,
			...updatedObj
		}))
	}

	useEffect(() => {
		const setCurrentDevice = async () => {
			const availableDevicesResponse = await spotifyApi.getMyDevices()

			if (availableDevicesResponse.body.devices.length) {
				const { id: deviceId, volume_percent } =
					availableDevicesResponse.body.devices[0]

				updateSongContextState({
					deviceId,
					volume: volume_percent as number
				})

				await spotifyApi.transferMyPlayback([deviceId as string])
			}
		}

		if (spotifyApi.getAccessToken()) setCurrentDevice()
	}, [spotifyApi, session])

	useEffect(() => {
		const getCurrentPlayingSong = async () => {
			const songInfo = await spotifyApi.getMyCurrentPlayingTrack()

			if (songInfo.body) {
				updateSongContextState({
					selectedSongId: songInfo.body.item?.id,
					selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
					isPlaying: songInfo.body.is_playing
				})
			}
		}

		if (spotifyApi.getAccessToken() && !songContextState.selectedSongId) {
			getCurrentPlayingSong()
		}
	}, [songContextState.selectedSongId, spotifyApi, session])

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
