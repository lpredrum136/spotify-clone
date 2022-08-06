import { ComponentProps, MouseEventHandler } from 'react'

// TS copied from hovering over <HomeIcon /> for example
const IconButton = ({
	icon: Icon,
	label,
	onClick
}: {
	icon: (props: ComponentProps<'svg'>) => JSX.Element
	label: string
	onClick?: MouseEventHandler<HTMLButtonElement>
}) => {
	return (
		<button
			className='flex items-center space-x-2 hover:text-white'
			onClick={onClick}
		>
			<Icon className='icon' />
			<span>{label}</span>
		</button>
	)
}

export default IconButton
