

export type ActionRendererProps = {
	isAbility: boolean,
	name: string,
	cost: string,
	output: string,
	modifier: string,
	description: string,
	dimensions: {
		width: number,
		height: number
	},
	extraOffset: boolean
}