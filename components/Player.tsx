import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState } from 'react'
import { useSongContext } from '../contexts/SongContext'
import useSpotify from '../hooks/useSpotify'

const Player = () => {
	const spotifyApi = useSpotify()
	const { data: session, status } = useSession()
	const {
		songContextState: { isPlaying, selectedSongId, selectedSong }
	} = useSongContext()
	const [volume, setVolume] = useState(50)

	return (
		<div>
			{/* Left */}
			<div>
				{selectedSong && (
					<Image
						src={selectedSong?.album.images[0].url}
						alt={`Album cover for ${selectedSong?.name}`}
						height='40px'
						width='40px'
						className='hidden md:block'
					/>
				)}
			</div>
		</div>
	)
}

export default Player
