import {
	HomeIcon,
	SearchIcon,
	LibraryIcon,
	PlusCircleIcon,
	HeartIcon,
	RssIcon
} from '@heroicons/react/outline'
import IconButton from './IconButton'

const Divider = () => <hr className='border-t-[0.1px] border-gray-900' />

const Sidebar = () => {
	return (
		<div className='text-gray-500 p-5 text-sm border-r border-gray-900'>
			<div className='space-y-4'>
				<IconButton icon={HomeIcon} label='Home' />
				<IconButton icon={SearchIcon} label='Search' />
				<IconButton icon={LibraryIcon} label='Your Library' />

				<Divider />

				<IconButton icon={PlusCircleIcon} label='Create Playlist' />
				<IconButton icon={HeartIcon} label='Liked Songs' />
				<IconButton icon={RssIcon} label='Your Episodes' />

				<Divider />

				{/* Playlist */}
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
				<p className='cursor-pointer hover:text-white'>Playlist Name...</p>
			</div>
		</div>
	)
}

export default Sidebar
