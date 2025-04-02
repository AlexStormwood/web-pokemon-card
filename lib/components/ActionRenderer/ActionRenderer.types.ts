
export type CardAction = {
	isAbility: boolean,
	name: string,
	cost: string,
	output: string,
	modifier: string,
	description: string,
}

export type ActionRendererProps = CardAction & {
	dimensions: {
		width: number,
		height: number
	},
	extraOffset: boolean
}