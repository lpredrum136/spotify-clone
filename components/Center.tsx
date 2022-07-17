import { useSession } from 'next-auth/react'
import Image from 'next/image'
import UserIcon from '../assets/user.png'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { pickRandom } from '../utils/pickRandom'
import { usePlaylistContext } from '../contexts'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const colours = [
	'from-indigo-500',
	'from-blue-500',
	'from-green-500',
	'from-red-500',
	'from-yellow-500',
	'from-pink-500',
	'from-purple-500'
]

const Center = () => {
	const { data: session } = useSession()
	const [fromColour, setFromColour] = useState<string | null>(null)
	const { playlistContextState, updatePlaylistContextState } =
		usePlaylistContext()
	const spotifyApi = useSpotify()

	useEffect(() => {
		setFromColour(pickRandom(colours))
	}, [playlistContextState.selectedPlaylistId])

	useEffect(() => {
		const getPlaylist = async () => {
			try {
				const playlistResponse = await spotifyApi.getPlaylist(
					playlistContextState.selectedPlaylistId as string
				)
				updatePlaylistContextState({ selectedPlaylist: playlistResponse.body })
			} catch (error) {
				console.error('Error. Failed to fetch playlist. ', error)
			}
		}

		if (playlistContextState.selectedPlaylistId) {
			getPlaylist()
		}
	}, [
		playlistContextState.selectedPlaylistId,
		spotifyApi
		// updatePlaylistContextState
	])

	return (
		<div className='flex-grow text-white relative'>
			<header className='absolute top-5 right-8'>
				<div className='flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full py-1 pl-1 pr-2'>
					<Image
						src={session?.user?.image || UserIcon}
						alt='User Avatar'
						height='40px'
						width='40px'
						className='rounded-full object-cover'
					/>
					<h2>{session?.user?.name}</h2>
					<ChevronDownIcon className='h-5 w-5' />
				</div>
			</header>

			<section
				className={`flex items-end space-x-7 bg-gradient-to-b ${fromColour} to-black h-80 text-white p-8`}
			>
				{playlistContextState.selectedPlaylist && (
					<>
						<Image
							src={playlistContextState.selectedPlaylist.images[0].url}
							alt='Playlist Image'
							height='176px'
							width='176px'
							className='shadow-2xl'
						/>
						<div>
							<p>PLAYLIST</p>
							<h1 className='text-2xl font-bold md:text-3xl xl:text-5xl'>
								{playlistContextState.selectedPlaylist.name}
							</h1>
						</div>
					</>
				)}
			</section>

			<div>
				<Songs />
			</div>
		</div>
	)
}

export default Center
