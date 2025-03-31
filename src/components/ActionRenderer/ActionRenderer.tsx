import { ActionRendererProps } from "./ActionRenderer.types";


export default function ActionRenderer({
	isAbility,
	name,
	cost,
	output,
	modifier,
	description,
	dimensions
}: ActionRendererProps){

	return(
		<section className="actionRenderer" style={{
			display: "flex",
			flexDirection: "column",
			backgroundColor: "rgba(254, 167, 255, 0.43)",
			width: "100%",
			justifyContent: "center",
			alignItems: "center"
		}}>
			<div className="actionMain" style={{
				display: "flex",
				flexDirection: "row",
				width: "100%",
				justifyContent:"space-evenly"
			}}>
				{isAbility ?
				<div className="actionAbility">
					<p>Ability</p>
				</div>
				:
				<div className="actionCost">
					{cost}
				</div>
				}
				<div className="actionTitle">
					{name}
				</div>
				<div className="actionOutput">
					{output}
				</div>
				<div className="actionModifier">
					{modifier}
				</div>
			</div>
			<div className="actionDescription" style={{
				fontSize: `${dimensions.height / 6.5}%`,
				fontWeight: `600`,
				textAlign: "left"
			}}>
				<p>
					{description}
				</p>
			</div>
		</section>
	)
}