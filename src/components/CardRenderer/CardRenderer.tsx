import ActionRenderer from "../ActionRenderer/ActionRenderer";
import "./CardRenderer.css";


import { useEffect, useRef, useState } from "react";
import { CardData } from "./CardRenderer.types";
import { capitalizeFirstLetter } from "../../utils/capitaliseFirstletter";

export const themes = {
	pocket: {},
};

export default function CardRenderer({cardScale, cardId}: {cardScale: string, cardId: string}) {

	let [cardArt, setCardArt] = useState<{ default: string }>();
	let [cardDebug, setCardDebug] = useState<{ default: string }>();
	let [cardData, setCardData] = useState<CardData>();

	let [borderThickness, setBorderThickness] = useState(1);
	let [borderColourHex] = useState("#dedfdf");
	let [cornerRoundness, setCornerRoundness] = useState(1);


	const refContainer = useRef<HTMLElement>(null);
	const [dimensions, setDimensions] = useState({
		width: 0, height: 0
	});
	const [cardMaxRotation] = useState(30);


	useEffect(() => {

		const importAssets = async () => {
			// So, realistically, replace this function with something that
			// fetches the image URLs from the server.
			// It'd help remove the need for that DynamicImportType in the state declarations, too.
			const targetCardArt = await import(`../../assets/debug/${cardId}/art.png`);
			setCardArt(targetCardArt);

			const targetCardDebug = await import(`../../assets/debug/${cardId}/card.png`);
			setCardDebug(targetCardDebug);

			const targetCardData = await import(`../../assets/debug/${cardId}/data.json`);
			// console.log(targetCardData.default);
			setCardData(targetCardData.default);
		}

		importAssets();

		if (!refContainer.current) return; 
		
		
		const resizeObserver = new ResizeObserver(() => {
			setDimensions({
				width: refContainer.current!.offsetWidth,
				height: refContainer.current!.offsetHeight
			});

			// console.log(refContainer.current!.offsetWidth, refContainer.current!.offsetHeight)

			setBorderThickness((refContainer.current!.offsetHeight / 100) * 6)
			setCornerRoundness((refContainer.current!.offsetHeight / 1000) * 1.5);
		});

		resizeObserver.observe(refContainer.current);
		return () => resizeObserver.disconnect();

	}, []);

	let [x, setX] = useState("0");
	let [y, setY] = useState("0");

	const rotateToMouse = (event: React.MouseEvent) => {
		let bounds = event.currentTarget.getBoundingClientRect();
		const baseX = event.clientX - bounds.left;
		const baseY = event.clientY - bounds.top;
		const middleX = dimensions.width / 2;
		const middleY = dimensions.height / 2;
		const offsetX = ((baseX - middleX) / middleX) * cardMaxRotation;
		const offsetY = ((baseY - middleY) / middleY) * cardMaxRotation;

		// console.log(baseX, baseY, middleX, middleY, offsetX, offsetY);

		setX( -1 * offsetY + "deg");
		setY(offsetX + "deg");
	}

	const resetRotationAfterDelay = () => {
		setTimeout(() => {
			setX("0deg");
			setY("0deg");
		}, 1000);
	}

	// useEffect(() => {
	// 	// nothing
	// 	console.log("Border thickness changed");
	// }, [borderThickness])


	return (
		<section 
			className="cardRenderer" 
			ref={refContainer}
			onMouseMove={rotateToMouse}
			onMouseOut={resetRotationAfterDelay}
			style={{
				'--active-card-rotateY': y,
				'--active-card-rotateX': x,
				height:`${cardScale}dvh`
			} as React.CSSProperties}
		>
			<div className="cardContent" style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column"
			}}>




				<div className="cardHeader" style={{
					position: "relative",
					width: `${dimensions.width - (borderThickness)}px`,
					marginTop: `${(borderThickness / 2)}px`,
					marginLeft: `${(borderThickness / 2)}px`,
					height: `${dimensions.height / 16.5}px`,
					zIndex: `10`,
					backgroundColor: "rgba(254, 167, 255, 0.5)",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between"
				}}>
					<div className="cardTypeOneContainer">
						<p className="cardTypeOne" style={{
							position: "relative",
							textAlign: "left",
							lineHeight: `100%`,
							fontSize: `${dimensions.height / 35}px`,
							fontWeight: `500`,
							margin: `0`,
							marginTop: `20%`,
							letterSpacing: `-${dimensions.width / 3750}rem`
						}}>
							{cardData?.types[0].toLocaleUpperCase()}
						</p>
						
					</div>

					<div className="cardNameContainer" style={{
						display: "flex"
					}}>
						<p className="cardName" style={{
							position: "relative",
							textAlign: "left",
							lineHeight: `100%`,
							fontSize: `${dimensions.height / 19}px`,
							fontWeight: `900`,
							margin: `0`,
							letterSpacing: `-${dimensions.width / 3750}rem`
						}}>
							{cardData?.name ? capitalizeFirstLetter(cardData.name) : "Loading..."}
						</p>
						{cardData?.types.length && cardData?.types[1] && 
						<div className="cardTypeTwoContainer">
							<p className="cardTypeTwo" style={{
								position: "relative",
								textAlign: "left",
								lineHeight: `100%`,
								fontSize: `${dimensions.height / 35}px`,
								fontWeight: `500`,
								margin: `0`,
								marginTop: `2.5%`,
								letterSpacing: `-${dimensions.width / 3750}rem`
							}}>
								{cardData?.types[1].toLocaleUpperCase()}
							</p>
							
						</div>}
					</div>

					<div className="cardResourceOneContainer" style={{
						display: "flex"
					}}>
						<p>HP</p>
						<p className="cardResourceOne" style={{
							position: "relative",
							textAlign: "left",
							lineHeight: `100%`,
							fontSize: `${dimensions.height / 35}px`,
							fontWeight: `500`,
							margin: `0`,
							marginTop: `20%`,
							letterSpacing: `-${dimensions.width / 3750}rem`
						}}>
							{cardData?.resource1.toLocaleUpperCase()}
						</p>
						<p className="cardResourceType" style={{
							position: "relative",
							textAlign: "left",
							lineHeight: `100%`,
							fontSize: `${dimensions.height / 19}px`,
							fontWeight: `900`,
							margin: `0`,
							letterSpacing: `-${dimensions.width / 3750}rem`,
							paddingRight: `${(borderThickness / 4)}px`
						}}>
							{cardData?.resourceTypes[0]}
						</p>
					</div>
					
				</div>




				<div className="cardArtbox" style={{
					position: "relative",
					backgroundColor: "rgba(243, 245, 39, 0.5)",
					width: `${dimensions.width - (borderThickness)}px`,
					marginLeft: `${(borderThickness / 2)}px`,
					height: `${dimensions.height / 2.4}px`,
					display: "flex",
					justifyContent: "center"
				}}>
					<div className="cardArtFrame" style={{
						marginTop: `${(borderThickness / 10)}px`,
						
					}}>
						<img className="cardArtImage" src={cardArt?.default} style={{
							width: `92%`,
							aspectRatio: `1106/696`
						}} />
					</div>
				</div>

				<div className="cardActions" style={{
					position: "relative",
					backgroundColor: "rgba(167, 236, 255, 0.5)",
					width: `${dimensions.width - (borderThickness)}px`,
					marginLeft: `${(borderThickness / 2)}px`,
					height: `${dimensions.height / 2.95}px`,
					display: "flex",
					gap:`${dimensions.height / 25}px`,
					justifyContent: cardData?.actions.some((actionObj) => actionObj.isAbility) ? "start" : "center",
					flexDirection: "column"
				}}>
					{cardData?.actions.map((actionObj, index) => {
						return <ActionRenderer 
							key={actionObj.name + index}
							isAbility={actionObj.isAbility} 
							cost={actionObj.cost}
							description={actionObj.description}
							modifier={actionObj.modifier}
							name={actionObj.name}
							output={actionObj.output}
							dimensions={dimensions}
							extraOffset={cardData?.actions.some((actionObj) => actionObj.cost.length >= 5) ? true : false}
						/>
					})}

				</div>

				<div className="cardInfo" style={{
					position: "relative",
					backgroundColor: "rgba(255, 121, 25, 0.5)",
					width: `${dimensions.width - (borderThickness)}px`,
					marginLeft: `${(borderThickness / 2)}px`,
					marginBottom: `${(borderThickness / 2)}px`,
					flexGrow: "1",
					display: "flex",
					justifyContent: "center"
				}}>


				</div>


				<div className="cardBorder" style={{
					zIndex: "-1",
					width: `${dimensions.width}px`,
					height: `${dimensions.height}px`,
					borderRadius: `${cornerRoundness}rem`,
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}  >
					<svg
						className="cardHollow"
						xmlns="http://www.w3.org/2000/svg"
						style={{
							borderRadius: `${cornerRoundness}rem`,
							width: `100%`,
							height: `100%`,
						}}
					>
						<rect style={{
							'strokeWidth': `${borderThickness +"px"}`,
							width: `${dimensions.width}px`,
							height: `${dimensions.height}px`,
							backgroundColor: "red",
							fill: "none",
							stroke: borderColourHex
						} as React.CSSProperties} />
					</svg>
				</div>
			</div>
			<div className="debugHelpers" style={{
				height: `${dimensions.height}px`
				}}>
				<img src={cardDebug?.default} style={{
					zIndex: "-10",
					position: "relative",
					height: "100%"
				}} />
			</div>
		</section>
	);
}
