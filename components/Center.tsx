import { useSession } from 'next-auth/react'
import Image from 'next/image'
import UserIcon from '../assets/user.png'
import { ChevronDownIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import { pickRandom } from '../utils/pickRandom'

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

	useEffect(() => {
		setFromColour(pickRandom(colours))
	}, [])

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
				<Image
					src={session?.user?.image || UserIcon}
					alt='User Avatar'
					height='40px'
					width='40px'
					className='rounded-full object-cover'
				/>
				<h1>Hello</h1>
			</section>
		</div>
	)
}

export default Center
