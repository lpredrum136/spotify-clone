import {
	HomeIcon,
	SearchIcon,
	LibraryIcon,
	PlusCircleIcon,
	HeartIcon,
	RssIcon
} from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { usePlaylistContext } from '../contexts'
import useSpotify from '../hooks/useSpotify'
import IconButton from './IconButton'

const Divider = () => <hr className='border-t-[0.1px] border-gray-900' />

const Sidebar = () => {
	const { data: session, status } = useSession()
	const [playlists, setPlaylists] = useState<
		SpotifyApi.PlaylistObjectSimplified[]
	>([])
	const spotifyApi = useSpotify()
	const { updatePlaylistContextState } = usePlaylistContext()

	useEffect(() => {
		const getUserPlaylists = async () => {
			const userPlaylistsResponse = await spotifyApi.getUserPlaylists()
			setPlaylists(userPlaylistsResponse.body.items)
		}

		if (spotifyApi.getAccessToken()) {
			getUserPlaylists()
		}
	}, [spotifyApi, session])

	// If this console log returns null, it means we are not logged in
	// if it's undefined, session has not been fetched yet
	// https://next-auth.js.org/getting-started/client#usesession

	// console.log('SESSION', session)

	return (
		<div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 h-screen overflow-y-scroll scrollbar-hidden sm:max-w-[12rem] lg:max-w-[15rem] hidden md:block'>
			<div className='space-y-4'>
				<IconButton icon={HomeIcon} label='LOG OUT' onClick={() => signOut()} />
				<IconButton icon={HomeIcon} label='Home' />
				<IconButton icon={SearchIcon} label='Search' />
				<IconButton icon={LibraryIcon} label='Your Library' />

				<Divider />

				<IconButton icon={PlusCircleIcon} label='Create Playlist' />
				<IconButton icon={HeartIcon} label='Liked Songs' />
				<IconButton icon={RssIcon} label='Your Episodes' />

				<Divider />

				{/* Playlist */}
				{playlists.map(({ id, name }) => (
					<p
						key={id}
						className='cursor-pointer hover:text-white'
						onClick={() => {
							updatePlaylistContextState({ selectedPlaylistId: id })
						}}
					>
						{name}
					</p>
				))}
			</div>
		</div>
	)
}

export default Sidebar
