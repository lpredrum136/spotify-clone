import { createContext, ReactNode, useContext, useState } from 'react'

interface SongContextState {
	selectedSongId: string | null
	isPlaying: boolean
}

interface ISongContext {
	songContextState: SongContextState
	updateSongContextState: (updatedObj: Partial<SongContextState>) => void
}

const defaultSongContextState: ISongContext['songContextState'] = {
	selectedSongId: null,
	isPlaying: false
}

export const SongContext = createContext<ISongContext>({
	songContextState: defaultSongContextState,
	updateSongContextState: () => {}
})

export const useSongContext = () => useContext(SongContext)

const SongContextProvider = ({ children }: { children: ReactNode }) => {
	const [songContextState, setSongContextState] = useState<SongContextState>(
		defaultSongContextState
	)

	const updateSongContextState = (updatedObj: Partial<SongContextState>) => {
		setSongContextState({
			...songContextState,
			...updatedObj
		})
	}

	const songContextProviderData = {
		songContextState,
		updateSongContextState
	}

	return (
		<SongContext.Provider value={songContextProviderData}>
			{children}
		</SongContext.Provider>
	)
}

export default SongContextProvider
