import { ActionRendererProps } from "./ActionRenderer.types";

export default function ActionRenderer({
	isAbility,
	name,
	cost,
	output,
	modifier,
	description,
	dimensions,
	extraOffset
}: ActionRendererProps){

	return(
		<section className="actionRenderer" style={{
			display: "flex",
			flexDirection: "column",
			backgroundColor: "rgba(254, 167, 255, 0.43)",
			width: "100%",
			justifyContent: "center",
			alignItems: "center",
			
		}}>


			<div className="actionMain" style={{
				display: "flex",
				flexDirection: "row",
				width: "100%",
				height: `${dimensions.height / 17}px`,
				justifyContent:"left",
				verticalAlign: "bottom"
			}}>


				<div className="actionLeading"  style={{
						
						width: `${dimensions.width / (extraOffset ? 3.175 : 3.95)}px`,
						paddingLeft: `${dimensions.width / 75}px`
					}}>
					{isAbility ?
					<div className="actionAbility"  style={{
						fontSize: `${dimensions.height / 42}px`,
						fontStyle: "italic",
						fontWeight: `600`,
						textAlign: "left",
						paddingLeft: `${dimensions.width / 16.5}px`
					}}>
						<p>Ability</p>
					</div>
					:
					<div className="actionCost"  style={{
						fontSize: `${dimensions.height / 25}px`,
						fontWeight: `600`,
						textAlign: "left",
						paddingLeft: "2.5%"
					}}>
						{cost}
					</div>
					}
				</div>


				<div className="actionTitle" style={{
					fontSize: `${dimensions.height / 4}%`,
					fontWeight: `600`,
					textAlign: "left",
				}}>
					{name}
				</div>
				<div className="actionOutput" style={{
					fontSize: `${dimensions.height / 4}%`,
					fontWeight: `600`,
					textAlign: "left"
				}}>
					{output}
				</div>


				<div className="actionModifier">
					{modifier}
				</div>


			</div>



			<div className="actionDescription" style={{
				fontSize: `${dimensions.height / 6.5}%`,
				fontWeight: `600`,
				textAlign: "left",
				width: "100%",
				boxSizing: "border-box"
			}}>
				<p style={{
					margin: 0,
					width: "100%",
					paddingLeft: isAbility ? `${dimensions.width / 31}px` : `${dimensions.width / 31}px`,
					
				boxSizing: "border-box"
				}}>
					{description}
				</p>
			</div>
		</section>
	)
}