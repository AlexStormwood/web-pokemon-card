import { CardAction } from "../ActionRenderer/ActionRenderer.types"

export type CardData = {
	name: string,
	illustrator: string,
	types: string[],
	resourceTypes: string[],
	rarity: string,
	actions: CardAction[],
	resource1: string, // HP in PTCG, Toughness in MTG
	resource2: string, // Retreat Cost in PTCG, Power in MTG
	resource3: string, // unused for now
	id?: string, // id of card in database
	categories?: string[],
	evolvesFrom?: string,
	weakness?: {
		energyType: string,
		modifier: number
	},
	resistance?: {
		energyType: string,
		modifier: string
	},
	flavourText?: string,
	imageUrls?: string[], // imageUrls[0] is background, higher numbers are closer to foreground, useful for masking characters in holofoils
	ruleboxes?: string[],
	overlayFoil?: boolean,
	borderFoil?: boolean,
	artFoil?: boolean,
	backgroundFoil?: boolean,
	borderFoils?: string[],
	borderFoilMasks?: string[],
	artFoils?: string[],
	artFoilMasks?: string[],
	backgroundFoils?: string[]
	backgroundFoilMasks?: string[],
	backgroundTextureOverride?: string
}

export type CardRendererProps = {
	targetCardData: CardData;
	targetCardScale?: string;
	targetCardDebugImage?: string;
	targetDebugViewEnabled?: boolean;
	targetMaxRotation?: number;
	targetFoilType?: string;
}

/*
Example:

{
	name: "pikachu",
	illustrator: "ken sugimori",
	types: [
		"basic"
	],
	resourceTypes: [
		"L"
	],
	rarity: "c",
	actions: [
		{
			"isAbility": false,
			"name":"Headbutt",
			"cost":"CC",
			"output":"30",
			"modifier":"",
			"description":""
		}
	],
	categories: [
		"pikachu"
	],
	weakness: {
		energyType: "F",
		modifier: "x2"
	},
	flavourText: "Pikachu is a fun li'l guy. Everybody loves a fun li'l guy.",
	retreatCost: "C"
}

{
	name: "raichu",
	illustrator: "ken sugimori",
	types: [
		"stage 1",
		"ex"
	],
	resourceTypes: [
		"L"
	],
	rarity: "double-rare"
	actions: [
		{
			"isAbility": false,
			"name":"Shocking Surf",
			"cost":"LLCC",
			"output":"120",
			"modifier":"",
			"description":"Discard all L Energy from this Pokémon."
		}
	],
	categories: [
		"raichu",
		"alolan"
	],
	weakness: {
		energyType: "F",
		modifier: "x2"
	},
	flavourText: "Raichu learned how to surf! They're so cool!",
	retreatCost: "C",
	ruleboxes: [
		"ex rule"
	]
}

*/