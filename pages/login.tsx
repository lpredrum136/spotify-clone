import { GetServerSideProps } from 'next'
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react'
import SpotifyLogo from '../assets/spotify-logo.png'
import Image from 'next/image'

interface Props {
	providers: Awaited<ReturnType<typeof getProviders>>
}

const Login = ({ providers }: Props) => {
	const { name: providerName, id: providerId } =
		providers?.spotify as ClientSafeProvider

	return (
		<div className='flex flex-col justify-center items-center bg-black h-screen'>
			<div className='mb-6'>
				<Image
					src={SpotifyLogo}
					alt='Spotify Logo'
					height='200px'
					width='200px'
				/>
			</div>

			<button
				className='bg-[#18D860] text-white p-5 rounded-full'
				onClick={() => {
					// https://next-auth.js.org/getting-started/client#specifying-a-callbackurl
					// after sign in, where do you go to?
					signIn(providerId, { callbackUrl: '/' })
				}}
			>
				Login with {providerName}
			</button>
		</div>
	)
}

export default Login

// https://next-auth.js.org/configuration/pages#oauth-sign-in
export const getServerSideProps: GetServerSideProps<Props> = async context => {
	const providers = await getProviders()
	return {
		props: {
			providers
		}
	}
}
