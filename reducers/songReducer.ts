export interface SongContextState {
	selectedSongId?: string
	selectedSong: SpotifyApi.TrackObjectFull | null
	isPlaying: boolean
	volume: number
	deviceId: string | null
}

export enum SongReducerActionType {
	SetDevice,
	SetCurrentPlayingSong,
	ToggleIsPlaying,
	SetVolume
}

export type SongReducerAction =
	| {
			type: SongReducerActionType.SetDevice

			payload: Pick<SongContextState, 'deviceId' | 'volume'>
	  }
	| {
			type: SongReducerActionType.SetCurrentPlayingSong

			payload: Pick<
				SongContextState,
				'selectedSongId' | 'selectedSong' | 'isPlaying'
			>
	  }
	| {
			type: SongReducerActionType.ToggleIsPlaying
			payload: boolean
	  }
	| {
			type: SongReducerActionType.SetVolume
			payload: number
	  }

export const songReducer = (
	state: SongContextState,
	{ payload, type }: SongReducerAction
): SongContextState => {
	switch (type) {
		case SongReducerActionType.SetDevice:
			return {
				...state,
				deviceId: payload.deviceId,
				volume: payload.volume
			}

		case SongReducerActionType.SetCurrentPlayingSong:
			return {
				...state,
				selectedSongId: payload.selectedSongId,
				selectedSong: payload.selectedSong,
				isPlaying: payload.isPlaying
			}

		case SongReducerActionType.ToggleIsPlaying:
			return {
				...state,
				isPlaying: payload
			}

		case SongReducerActionType.SetVolume:
			return {
				...state,
				volume: payload
			}

		default:
			return state
	}
}
