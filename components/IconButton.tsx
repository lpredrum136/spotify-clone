import { ComponentProps } from 'react'

// TS copied from hovering over <HomeIcon /> for example
const IconButton = ({
	icon: Icon,
	label
}: {
	icon: (props: ComponentProps<'svg'>) => JSX.Element
	label: string
}) => {
	return (
		<button className='flex items-center space-x-2 hover:text-white'>
			<Icon className='h-5 w-5' />
			<span>{label}</span>
		</button>
	)
}

export default IconButton
