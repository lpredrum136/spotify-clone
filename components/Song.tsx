import Image from 'next/image'
import { usePlaylistContext } from '../contexts/PlaylistContext'
import { useSongContext } from '../contexts/SongContext'
import useSpotify from '../hooks/useSpotify'
import { convertDuration } from '../utils/durationConverter'

const Song = ({
	item: { track },
	itemIndex
}: {
	item: SpotifyApi.PlaylistTrackObject
	itemIndex: number
}) => {
	const spotifyApi = useSpotify()

	const {
		songContextState: { deviceId },
		updateSongContextState
	} = useSongContext()

	const {
		playlistContextState: { selectedPlaylist }
	} = usePlaylistContext()

	const playSong = async () => {
		if (deviceId) {
			updateSongContextState({
				selectedSongId: track?.id,
				selectedSong: track,
				isPlaying: true
			})

			await spotifyApi.play({
				// uris: [track?.uri as string]
				device_id: deviceId,
				context_uri: selectedPlaylist?.uri,
				offset: {
					uri: track?.uri as string
				}
			})
		}
	}

	return (
		<div
			className='grid grid-cols-2 text-gray-500 px-5 py-4 hover:bg-gray-900 rounded-lg cursor-pointer'
			onClick={playSong}
		>
			<div className='flex items-center space-x-4'>
				<p>{itemIndex + 1}</p>
				<div>
					<Image
						src={track?.album.images[0].url || ''}
						alt='Spotify Logo'
						height='40px'
						width='40px'
					/>
				</div>
				<div>
					<p className='w-36 lg:w-72 truncate text-white'>{track?.name}</p>
					<p className='w-40'>{track?.artists[0].name}</p>
				</div>
			</div>

			<div className='flex justify-between items-center ml-auto md:ml-0'>
				<p className='hidden md:block w-40'>{track?.album.name}</p>
				<p>{convertDuration(track?.duration_ms as number)}</p>
			</div>
		</div>
	)
}

export default Song
