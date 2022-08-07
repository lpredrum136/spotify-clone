import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import {
	defaultSongContextState,
	useSongContext
} from '../contexts/SongContext'
import useSpotify from '../hooks/useSpotify'
import {
	PauseIcon,
	PlayIcon,
	RewindIcon,
	SwitchHorizontalIcon
} from '@heroicons/react/solid'

const Player = () => {
	const spotifyApi = useSpotify()
	const { data: session, status } = useSession()
	const {
		songContextState: { isPlaying, selectedSongId, selectedSong },
		updateSongContextState
	} = useSongContext()

	const handlePlayPause = () => {
		spotifyApi.play()
	}

	return (
		<div className='h-24 bg-gradient-to-b from-black to-gray-900 grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
			{/* Left */}
			<div className='flex items-center space-x-4'>
				{selectedSong && (
					<>
						<div className='hidden md:block'>
							<Image
								src={selectedSong?.album.images[0].url}
								alt={`Album cover for ${selectedSong?.name}`}
								height='40px'
								width='40px'
							/>
						</div>
						<div>
							<h3>{selectedSong.name}</h3>
							<p>{selectedSong.artists[0].name}</p>
						</div>
					</>
				)}
			</div>

			{/* Center */}
			<div className='flex justify-evenly items-center'>
				<SwitchHorizontalIcon className='icon-playback' />
				<RewindIcon
					className='icon-playback'
					onClick={async () => {
						await spotifyApi.skipToPrevious()

						const songInfo = await spotifyApi.getMyCurrentPlayingTrack()

						if (songInfo.body) {
							updateSongContextState({
								selectedSongId: songInfo.body.item?.id,
								selectedSong: songInfo.body.item as SpotifyApi.TrackObjectFull,
								isPlaying: songInfo.body.is_playing,
								volume: defaultSongContextState.volume
							})
						}
					}}
				/>
				{isPlaying ? (
					<PauseIcon className='icon-playback' onClick={handlePlayPause} />
				) : (
					<PlayIcon className='icon-playback' onClick={handlePlayPause} />
				)}
			</div>
		</div>
	)
}

export default Player
