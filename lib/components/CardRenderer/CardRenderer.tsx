import ActionRenderer from "../ActionRenderer/ActionRenderer";
import "./CardRenderer.css";


import { useEffect, useRef, useState } from "react";
import { CardData, CardRendererProps } from "./CardRenderer.types";
import { capitalizeFirstLetter } from "../../utils/capitaliseFirstletter";



export default function CardRenderer({
	targetCardData,
	targetCardScale,
	targetCardDebugImage,
	targetDebugViewEnabled,
	targetMaxRotation,
	targetFoilType
}: CardRendererProps) {

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
	const [cardMaxRotation, setCardMaxRotation] = useState(targetMaxRotation || 15);

	const [_, setFoilType] = useState("none");

	useEffect(() => {
		if (targetDebugViewEnabled != undefined){
			setDebugView(targetDebugViewEnabled);
		}
	}, [targetDebugViewEnabled]);

	useEffect(() => {
		setCardData(targetCardData);
	}, [targetCardData]);

	useEffect(() => {
		if (targetMaxRotation){
			setCardMaxRotation(targetMaxRotation);
		}
	}, [targetMaxRotation]);

	useEffect(() => {
		if (targetFoilType){
			setFoilType(targetFoilType);
		}
	}, [targetFoilType]);

	useEffect(() => {
		setCardDebugImage(targetCardDebugImage);
	}, [targetCardDebugImage]);

	useEffect(() => {
		if (targetCardScale){
			setCardScale(targetCardScale);
		}
	}, [targetCardScale]);

	useEffect(() => {
		

		if (cardRefContainer.current){

			const resizeObserver = new ResizeObserver(() => {
				setDimensions({
					width: cardRefContainer.current!.offsetWidth,
					height: cardRefContainer.current!.offsetHeight,
				});
	
				// console.log(cardRefContainer.current!.offsetWidth, cardRefContainer.current!.offsetHeight)
	
				setBorderThickness((cardRefContainer.current!.offsetHeight / 100) * 6);
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
		if (cardRefBounds == undefined){
			return;
		}
		cardRefContainer.current?.style.setProperty("--x", (event.clientX - cardRefBounds.x).toString());
		cardRefContainer.current?.style.setProperty("--y", (event.clientY - cardRefBounds.y).toString());

	};

	const resetRotationAfterDelay = () => {
		setTimeout(() => {
			setXRot("0deg");
			setYRot("0deg");
		}, 1000);
	};

	// useEffect(() => {
	// 	// nothing
	// 	console.log("Border thickness changed");
	// }, [borderThickness])

	return (
		<section
			className="cardRenderer shiny"
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
					transform: "perspective(1000px) rotateY(var(--active-card-rotateY)) rotateX(var(--active-card-rotateX))",
					overflow: "hidden",
					aspectRatio: "750/1050",
					fontFamily: "Gill Sans, Gill Sans MT",
					fontWeight: "bold"
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
					flexDirection: "column"
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
						zIndex: `10`,
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
							fontFamily: "PTSans"
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
								transform: "scaleY(75%)"
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

					<div className="rightCornerContainer" style={{
						marginLeft: "auto",
						width: `${dimensions.width / 4.5}px`,
						display: "flex",
						flexWrap: "nowrap",
						justifyContent: "right",
						gap: "4%"
					}}>
						<div
							className="cardResourceOneContainer"
							style={{
								display: "flex",
								width: `${dimensions.width / 7}px`,
								justifyContent: "right"
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
								verticalAlign: "middle"
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
									verticalAlign: "middle"
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
							marginTop: `${borderThickness / 10}px`,
						}}
					>
						<img
							className="cardArtImage"
							src={cardData?.imageUrls![0]}
							style={{
								width: `92%`,
								aspectRatio: `1106/696`,
							}}
						/>
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
					style={{
						zIndex: "-1",
						width: `${dimensions.width}px`,
						height: `${dimensions.height}px`,
						borderRadius: `${cornerRoundness}rem`,
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
								} as React.CSSProperties
							}
						/>
					</svg>
				</div>
			</div>
			{(debugView && cardDebugImage) && <div
				className="debugHelpers"
				style={{
					height: `${dimensions.height}px`,
					position: "absolute"
				}}
			>
				<img
					src={cardDebugImage}
					style={{
						zIndex: "-10",
						position: "relative",
						height: "100%",
					}}
				/>
			</div>
			}
		</section>
	);
}
