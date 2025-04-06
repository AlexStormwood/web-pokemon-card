import ActionRenderer from "../ActionRenderer/ActionRenderer";
import "./CardRenderer.css";

import { useEffect, useRef, useState } from "react";
import { CardData, CardRendererProps } from "./CardRenderer.types";
import { capitalizeFirstLetter } from "../../utils/capitaliseFirstletter";
import { hexToCSSFilter } from 'hex-to-css-filter';


let resourceTypesHexColours: {[key: string]: string} = {
	G: "#19A648",
	R: "#D8223B",
	W: "#05A8D9",
	L: "#FCD021",
	F: "#B16232",
	P: "#957DAB",
	C: "#D2D0CF",
	D: "#2E7077",
	M: "#9B9E8C",
	N: "#948F31",
	Y: "#D6457E"
}

export default function CardRenderer({
	targetCardData,
	targetCardScale,
	targetCardDebugImage,
	targetDebugViewEnabled,
	targetMaxRotation,
	targetFoilType,
}: CardRendererProps) {
	let localElementId = targetCardData.id || window.crypto.randomUUID();

	let [debugView, setDebugView] = useState(true);
	let [cardScale, setCardScale] = useState(targetCardScale || "20");
	let [cardDebugImage, setCardDebugImage] = useState<string>();
	let [cardData, setCardData] = useState<CardData>();

	let [borderThickness, setBorderThickness] = useState(1);
	let [borderColourHex] = useState("#dedfdf");
	let [cornerRoundness, setCornerRoundness] = useState(1);

	const cardRefContainer = useRef<HTMLElement>(null);
	const [dimensions, setDimensions] = useState({
		width: 0,
		height: 0,
	});
	const [cardMaxRotation, setCardMaxRotation] = useState(
		targetMaxRotation || 15
	);

	const [_, setFoilType] = useState("none");
	const borderRefContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (targetDebugViewEnabled != undefined) {
			setDebugView(targetDebugViewEnabled);
		}
	}, [targetDebugViewEnabled]);

	useEffect(() => {
		setCardData(targetCardData);
	}, [targetCardData]);

	useEffect(() => {
		if (targetMaxRotation) {
			setCardMaxRotation(targetMaxRotation);
		}
	}, [targetMaxRotation]);

	useEffect(() => {
		if (targetFoilType) {
			setFoilType(targetFoilType);
		}
	}, [targetFoilType]);

	useEffect(() => {
		setCardDebugImage(targetCardDebugImage);
	}, [targetCardDebugImage]);

	useEffect(() => {
		if (targetCardScale) {
			setCardScale(targetCardScale);
		}
	}, [targetCardScale]);

	useEffect(() => {
		if (cardRefContainer.current) {
			const resizeObserver = new ResizeObserver(() => {
				setDimensions({
					width: cardRefContainer.current!.offsetWidth,
					height: cardRefContainer.current!.offsetHeight,
				});

				// console.log(cardRefContainer.current!.offsetWidth, cardRefContainer.current!.offsetHeight)

				setBorderThickness(
					(cardRefContainer.current!.offsetHeight / 100) * 6
				);
				setCornerRoundness(
					(cardRefContainer.current!.offsetHeight / 1000) * 1.5
				);
			});

			resizeObserver.observe(cardRefContainer.current);
			return () => resizeObserver.disconnect();
		}
	}, []);

	let [xRot, setXRot] = useState("0");
	let [yRot, setYRot] = useState("0");
	let [xMouseInCard, setXMouseInCard] = useState(0);
	let [yMouseInCard, setYMouseInCard] = useState(0);

	const reactToMouse = (event: React.MouseEvent) => {
		// Stuff for card rotation:
		let bounds = event.currentTarget.getBoundingClientRect();
		const baseX = event.clientX - bounds.left;
		const baseY = event.clientY - bounds.top;
		const middleX = dimensions.width / 2;
		const middleY = dimensions.height / 2;
		const offsetX = ((baseX - middleX) / middleX) * cardMaxRotation;
		const offsetY = ((baseY - middleY) / middleY) * cardMaxRotation;
		setXRot(-1 * offsetY + "deg");
		setYRot(offsetX + "deg");

		// Stuff for mouse flashlight:
		let cardRefBounds = cardRefContainer.current?.getBoundingClientRect();
		if (cardRefBounds == undefined) {
			return;
		}

		let localXMouseInCard = event.clientX - cardRefBounds.x;
		let localYMouseInCard = event.clientY - cardRefBounds.y;
		cardRefContainer.current?.style.setProperty(
			"--x",
			localXMouseInCard.toString()
		);
		cardRefContainer.current?.style.setProperty(
			"--y",
			localYMouseInCard.toString()
		);
		setXMouseInCard(localXMouseInCard);
		setYMouseInCard(localYMouseInCard);

		// Scale the flashlight as the card size changes:
		[...document.styleSheets[1].cssRules].find((rule) => {
			if ((rule as CSSStyleRule).selectorText == ".shiny::after") {
				let localRule = rule as CSSStyleRule;
				localRule.style.opacity = "0.4";
				localRule.style.width = `${dimensions.width}px`;
				localRule.style.height = `${dimensions.width}px`;
				localRule.style.top = (
					(event.clientY - cardRefBounds.y) * 1 -
					dimensions.height
				).toString();
				localRule.style.left = (
					(event.clientX - cardRefBounds.x) * 1 -
					dimensions.width
				).toString();
			} else {
				return false;
			}
		});
	};


	const resetRotationAfterDelay = () => {
		setTimeout(() => {
			setXRot("0deg");
			setYRot("0deg");

			[...document.styleSheets[1].cssRules].find((rule) => {
				if ((rule as CSSStyleRule).selectorText == ".shiny::after") {
					let localRule = rule as CSSStyleRule;
					localRule.style.opacity = "0";
					localRule.style.top = (dimensions.height / 2).toString();
					localRule.style.left = (dimensions.width / 2).toString();
				} else {
					return false;
				}
			});
		}, 1000);
	};

	let [overlayDarkenAmount] = useState(0.15);
	let [overlayHighlightAmount] = useState(0.5);

	const lightenOverlay = (targetElem: HTMLElement) => {

		if (
			(!cardData?.overlayFoil && !cardData?.artFoil && !cardData?.backgroundFoil && !cardData?.borderFoil)
		) {
			targetElem.style.backgroundColor = "rgba(0, 0, 0, 0)";

			let targetCircle: SVGCircleElement = (targetElem.querySelectorAll("circle")[0]);
			targetCircle.style.opacity = "0";
		}

		
	}

	const darkenOverlay = (targetElem: HTMLElement) => {

		if (
			(!cardData?.overlayFoil && !cardData?.artFoil && !cardData?.backgroundFoil && !cardData?.borderFoil)
		) {
			targetElem.style.backgroundColor = `rgba(0, 0, 0, ${overlayDarkenAmount})`;

			let targetCircle: SVGCircleElement = (targetElem.querySelectorAll("circle")[0]);
			targetCircle.style.opacity = overlayHighlightAmount.toString();
		}

		
	}

	// useEffect(() => {
	// 	// nothing
	// 	console.log("Border thickness changed");
	// }, [borderThickness])

	return (
		<section
			className="cardRenderer"
			ref={cardRefContainer}
			onMouseMove={reactToMouse}
			onMouseOut={resetRotationAfterDelay}
			style={
				{
					"--active-card-rotateY": yRot,
					"--active-card-rotateX": xRot,
					height: `${cardScale}dvh`,
					color: "#221814",
					position: "relative",
					transformStyle: "preserve-3d",
					transition: "0.5s",
					transform:
						"perspective(1000px) rotateY(var(--active-card-rotateY)) rotateX(var(--active-card-rotateX))",
					overflow: "hidden",
					aspectRatio: "750/1050",
					fontFamily: "Gill Sans, Gill Sans MT",
					fontWeight: "bold",
					// backgroundImage: `url(${cardData?.backgroundTextureOverride})`
				} as React.CSSProperties
			}
		>
			<div
				className="cardContent"
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div
					className="cardHeader"
					style={{
						position: "relative",
						width: `${dimensions.width - borderThickness}px`,
						marginTop: `${borderThickness / 2}px`,
						marginLeft: `${borderThickness / 2}px`,
						height: `${dimensions.height / 16.5}px`,
						zIndex: `1`,
						backgroundColor: "rgba(254, 167, 255, 0.5)",
						display: "flex",
						flexDirection: "row",
					}}
				>
					<div
						className="cardTypeOneContainer"
						style={{
							width: `${dimensions.width / 7.25}px`,
							fontWeight: "bold",
							fontStyle: "italic",
							fontFamily: "PTSans",
						}}
					>
						<p
							className="cardTypeOne"
							style={{
								position: "relative",
								textAlign: "left",
								lineHeight: `100%`,
								fontSize: `${dimensions.height / 32.5}px`,
								margin: `0`,
								marginTop: `15%`,
								// marginLeft: "1%",
								letterSpacing: `-${dimensions.width / 5500}rem`,
								transform: "scaleY(75%)",
							}}
						>
							{cardData?.types[0].toLocaleUpperCase()}
						</p>
					</div>

					<div
						className="cardNameContainer"
						style={{
							display: "flex",
							width: `${dimensions.width / 2}px`,
						}}
					>
						<p
							className="cardName"
							style={{
								position: "relative",
								textAlign: "left",
								lineHeight: `100%`,
								fontSize: `${dimensions.height / 19.5}px`,
								fontWeight: `900`,
								margin: `0`,
								marginTop: `1.5%`,
								letterSpacing: `-${dimensions.width / 5000}rem`,
							}}
						>
							{cardData?.name
								? capitalizeFirstLetter(cardData.name)
								: "Loading..."}
						</p>
						{cardData?.types.length && cardData?.types[1] && (
							<div className="cardTypeTwoContainer">
								<p
									className="cardTypeTwo"
									style={{
										position: "relative",
										textAlign: "left",
										lineHeight: `100%`,
										fontSize: `${dimensions.height / 35}px`,
										fontWeight: `500`,
										margin: `0`,
										marginTop: `2.5%`,
										letterSpacing: `-${
											dimensions.width / 3750
										}rem`,
									}}
								>
									{cardData?.types[1].toLocaleUpperCase()}
								</p>
							</div>
						)}
					</div>

					<div
						className="rightCornerContainer"
						style={{
							marginLeft: "auto",
							width: `${dimensions.width / 4.5}px`,
							display: "flex",
							flexWrap: "nowrap",
							justifyContent: "right",
							gap: "4%",
						}}
					>
						<div
							className="cardResourceOneContainer"
							style={{
								display: "flex",
								width: `${dimensions.width / 7}px`,
								justifyContent: "right",
							}}
						>
							<p
								style={{
									fontSize: `${dimensions.height / 48}px`,
									fontWeight: `900`,
									margin: `0`,
									marginTop: `28%`,
									letterSpacing: `-${
										dimensions.width / 10000
									}rem`,
								}}
							>
								HP
							</p>
							<p
								className="cardResourceOne"
								style={{
									position: "relative",
									textAlign: "right",
									lineHeight: `100%`,
									fontSize: `${dimensions.height / 17.5}px`,
									fontWeight: `900`,
									margin: `0`,
									marginTop: `5%`,
									letterSpacing: `-${
										dimensions.width / 2000
									}rem`,
								}}
							>
								{cardData?.resource1.toLocaleUpperCase()}
							</p>
						</div>
						<div
							className="cardResourceTypesContainer"
							style={{
								display: "flex",
								height: "100%",
								aspectRatio: "1",
								justifyContent: "center",
								alignItems: "right",
								textAlign: "center",
								verticalAlign: "middle",
							}}
						>
							<p
								className="cardResourceType"
								style={{
									backgroundColor: "rgba(0, 255, 145, 0.47)",
									position: "relative",
									textAlign: "center",
									lineHeight: "100%",
									paddingTop: "10%",
									fontSize: `${dimensions.height / 20}px`,
									fontWeight: `900`,
									margin: `0`,
									letterSpacing: `-${
										dimensions.width / 3750
									}rem`,
									width: "100%",
									height: "100%",
									verticalAlign: "middle",
								}}
							>
								{cardData?.resourceTypes[0]}
							</p>
						</div>
					</div>
				</div>

				<div
					className="cardArtbox"
					style={{
						position: "relative",
						backgroundColor: "rgba(243, 245, 39, 0.5)",
						width: `${dimensions.width - borderThickness}px`,
						marginLeft: `${borderThickness / 2}px`,
						height: `${dimensions.height / 2.4}px`,
						display: "flex",
						justifyContent: "center",
					}}
				>
					<div
						className="cardArtFrame"
						style={{
							// marginTop: "4%",
							width: "92%",
							height: "92%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<div
							className="artBox"
							style={{
								width: "100%",
								height: "98%",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								position: "relative",
							}}
						>
							{cardData?.imageUrls?.map((imageUrl, index) => {
								if (index == 0 && cardData.artFoil) {
									return (
										<div
											className="cardArtImageContainer"
											key={imageUrl + index}
											id={imageUrl + index}
											style={{
												position: "absolute",
												height: "100%",
												width: "100%",
												display: "flex",
												justifyContent: "center",
												alignItems: "center"
											}}
										>
											<img
												className="cardArtImage"
												src={imageUrl}
												style={{
													height: `100%`,
													position: "absolute",
													zIndex: index + 1,
												}}
											/>
											<div
												className={`${localElementId}-${cardData?.name}-foilcontainer`}
												style={{
													// zIndex: "-1",
													width: `100%`,
													height: `100%`,
													// borderRadius: `${cornerRoundness}rem`,
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													position: "absolute",
												}}
											>
												<svg
													className="cardOverlayHollow"
													xmlns="http://www.w3.org/2000/svg"
													style={{
														// borderRadius: `${cornerRoundness}rem`,
														width: `100%`,
														height: `100%`,
													}}
												>
													<defs>
														<radialGradient id="ArtFoilRadial">
															<stop
																offset={"0%"}
																stopColor="rgba(255, 255, 255, 1)"
															/>
															<stop
																offset={"100%"}
																stopColor="rgba(255, 255, 255, 0)"
															/>
														</radialGradient>
													</defs>
													<mask
														id={`${localElementId}-borderMask-overlay`}
													></mask>
													<circle
														r={150}
														// width={300}
														// height={300}

														fill="url(#ArtFoilRadial)"
														// fill = "black"
														style={{
															display: "inline",
															// zIndex: "20",
															// width: "300px",
															// height: "300px",
															// content: "",
															position:
																"absolute",
															// border: "none",
															// maskImage: `element(#${localElementId}-overlay)`,
															// cursor: "pointer",
															// overflow: "hidden",
															// top: `${yMouseInCard - 150}px`,
															// left: `${xMouseInCard - 150}px`,
															transform: `translate(${xMouseInCard}px, ${yMouseInCard}px)`,
															mixBlendMode:
																"hard-light",
															opacity: 0.4,
															transition: `opacity 0.5s`,
														}}
													/>
												</svg>
											</div>
										</div>
									);
								} else {
									return (
										<div
											className="cardArtImageContainer"
											key={imageUrl + index}
											id={imageUrl + index}
											style={{
												position: "absolute",
												height: "100%",
												width: "100%",
												display: "flex",
												justifyContent: "center",
												alignItems: "center"
											}}
										>
											<img
												className="cardArtImage"
												src={imageUrl}
												style={{
													height: `100%`,
													position: "absolute",
													zIndex: index + 1,
												}}
											/>
										</div>
									);
								}
							})}
						</div>
					</div>
				</div>

				<div
					className="cardActions"
					style={{
						position: "relative",
						backgroundColor: "rgba(167, 236, 255, 0.5)",
						width: `${dimensions.width - borderThickness}px`,
						marginLeft: `${borderThickness / 2}px`,
						height: `${dimensions.height / 2.95}px`,
						display: "flex",
						gap: `${dimensions.height / 25}px`,
						justifyContent: cardData?.actions.some(
							(actionObj) => actionObj.isAbility
						)
							? "start"
							: "center",
						flexDirection: "column",
					}}
				>
					{cardData?.actions.map((actionObj, index) => {
						return (
							<ActionRenderer
								key={actionObj.name + index}
								isAbility={actionObj.isAbility}
								cost={actionObj.cost}
								description={actionObj.description}
								modifier={actionObj.modifier}
								name={actionObj.name}
								output={actionObj.output}
								dimensions={dimensions}
								extraOffset={
									cardData?.actions.some(
										(actionObj) =>
											actionObj.cost.length >= 5
									)
										? true
										: false
								}
							/>
						);
					})}
				</div>

				<div
					className="cardInfo"
					style={{
						position: "relative",
						backgroundColor: "rgba(255, 121, 25, 0.5)",
						width: `${dimensions.width - borderThickness}px`,
						marginLeft: `${borderThickness / 2}px`,
						marginBottom: `${borderThickness / 2}px`,
						flexGrow: "1",
						display: "flex",
						justifyContent: "center",
					}}
				></div>

				<div
					className="cardBorder"
					ref={borderRefContainer}
					style={{
						zIndex: "-1",
						width: `${dimensions.width}px`,
						height: `${dimensions.height}px`,
						borderRadius: `${cornerRoundness}rem`,
						backgroundColor: borderColourHex,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						position: "absolute"
					}}
				>
					
					<svg
						className="cardHollow"
						xmlns="http://www.w3.org/2000/svg"
						style={{
							borderRadius: `${cornerRoundness}rem`,
							width: `100%`,
							height: `100%`,
						// backgroundImage: `url(${cardData?.backgroundTextureOverride})`
						}}
					>
						<rect
							
							style={
								{
									strokeWidth: `${borderThickness + "px"}`,
									width: `${dimensions.width}px`,
									height: `${dimensions.height}px`,
									backgroundColor: "red",
									fill: "none",
									stroke: borderColourHex,
									borderRadius: `${cornerRoundness}rem`
								} as React.CSSProperties
							}
						/>
						<mask id="borderMask">
						
							
						</mask>
						{/* {cardData?.backgroundTextureOverride && 
							<img width={dimensions.width} height={dimensions.height} src={cardData.backgroundTextureOverride} />} */}
					</svg>
					
					<div className="cardBackground" style={{
						position:"absolute",
						width: `${dimensions.width - borderThickness}px`,
						height: `${dimensions.height - borderThickness}px`
					}}>
						{cardData?.backgroundTextureOverride ? 
						<img 
							width={dimensions.width - borderThickness} 
							height={dimensions.height - borderThickness} 
							src={"." + cardData.backgroundTextureOverride} 
							style={{
								backgroundColor: "black",
								color: "black",
								filter: hexToCSSFilter(resourceTypesHexColours[cardData.resourceTypes[0]]).filter
							}}
						/> 
						:
						<svg >
							<rect width={dimensions.width} height={dimensions.height} fill="grey" />
						</svg>
						}
					</div>
						
					
				</div>
			</div>
			{debugView && cardDebugImage && (
				<div
					className="debugHelpers"
					style={{
						height: `${dimensions.height}px`,
						position: "absolute",
					}}
				>
					<img
						src={cardDebugImage}
						style={{
							zIndex: "-1",
							position: "relative",
							height: "100%",
						}}
					/>
				</div>
			)}
			<div
				id={`${localElementId}-overlay`}
				className="cardOverlay "
				onMouseOver={(event) => darkenOverlay(event.currentTarget)}
				onMouseLeave={((event) => lightenOverlay(event.currentTarget))}
				style={{
					height: `${dimensions.height}px`,
					width: `${dimensions.width}px`,
					display: "inline",
					position: "absolute",
					backgroundColor: "rgba(0, 0, 0, 0)",
					// maskImage: "url(#borderMask)",
					zIndex: 1,
					borderRadius: `${cornerRoundness}rem`,
					transition: "background-color 0.5s"
				}}
			>
				{
						!cardData?.overlayFoil && 
						!cardData?.backgroundFoil &&
						!cardData?.artFoil &&
						!cardData?.borderFoil && (
							// If no foils are specified on the card,
							// just render a generic highlighting effect over the entire card face.
							<div
								className={`${localElementId}-${cardData?.name}-foilcontainer`}
								style={{
									// zIndex: "-1",
									width: `${dimensions.width}px`,
									height: `${dimensions.height}px`,
									borderRadius: `${cornerRoundness}rem`,
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									position: "absolute",
								}}
							>
								<svg
									className="cardOverlayHollow"
									xmlns="http://www.w3.org/2000/svg"
									style={{
										borderRadius: `${cornerRoundness}rem`,
										width: `100%`,
										height: `100%`,
									}}
								>
									<defs>
										<radialGradient id="CardHighlightRadial">
											<stop
												offset={"0%"}
												stopColor="rgba(255, 255, 255, 1)"
											/>
											<stop
												offset={"100%"}
												stopColor="rgba(255, 255, 255, 0)"
											/>
										</radialGradient>
									</defs>
									<mask
										id={`${localElementId}-borderMask-overlay`}
									></mask>
									<circle
										r={150}
										// width={300}
										// height={300}

										fill="url(#CardHighlightRadial)"
										// fill = "black"
										style={{
											display: "inline",
											zIndex: "20",
											// width: "300px",
											// height: "300px",
											// content: "",
											position: "absolute",
											// border: "none",
											// maskImage: `element(#${localElementId}-overlay)`,
											// cursor: "pointer",
											// overflow: "hidden",
											// top: `${yMouseInCard - 150}px`,
											// left: `${xMouseInCard - 150}px`,
											transform: `translate(${xMouseInCard}px, ${yMouseInCard}px)`,
											mixBlendMode: "screen",
											isolation: "isolate",
											opacity: 0.4,
											transition: `opacity 0.5s`,
										}}
									/>
								</svg>
							</div>
						)

					// <div
					// className={`${localElementId}-${cardData?.name}`}
					// style={{
					// 	display: "inline",
					// 	width: "300px",
					// 	height: "300px",
					// 	content: "",
					// 	position: "absolute",
					// 	// border: "none",
					// 	maskImage: `element(#${localElementId}-overlay)`,
					// 	cursor: "pointer",
					// 	overflow: "hidden",
					// 	top: `${yMouseInCard - 150}px`,
					// 	left: `${xMouseInCard - 150}px`,
					// 	background: `radial-gradient(circle, white, #3984ff00 70%)`,
					// 	backgroundColor: "rgba(0, 0, 0, 0.01)",

					// 	opacity: 0.4,
					// 	transition: `opacity 0.5s`
					// }}
					// >

					// </div>
				}
			</div>
		</section>
	);
}
