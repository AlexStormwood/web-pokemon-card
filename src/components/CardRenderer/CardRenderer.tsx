import "./CardRenderer.css";

import testingImage from "../../assets/cPK_10_005040_00_BIPPA_C_M_en_US_UT.png";
import testingArt from "../../assets/cPK_10_005040_00_BIPPA_C_L_ILL.png";
import { useEffect, useRef, useState } from "react";

export const themes = {
	pocket: {},
};

export default function CardRenderer({cardScale}: {cardScale: string}) {

	let [borderThickness, setBorderThickness] = useState(1);
	let [borderColourHex] = useState("#dedfdf");
	let [cornerRoundness] = useState(1);


	const refContainer = useRef<HTMLElement>(null);
	const [dimensions, setDimensions] = useState({
		width: 0, height: 0
	});



	useEffect(() => {
		if (!refContainer.current) return; 
		
		
		const resizeObserver = new ResizeObserver(() => {
			setDimensions({
				width: refContainer.current!.offsetWidth,
				height: refContainer.current!.offsetHeight
			});

			console.log(refContainer.current!.offsetWidth, refContainer.current!.offsetHeight)

			setBorderThickness((refContainer.current!.offsetHeight / 100) * 6)
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
		const offsetX = ((baseX - middleX) / middleX) * 45;
		const offsetY = ((baseY - middleY) / middleY) * 45;

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
					backgroundColor: "rgba(254, 167, 255, 0.43)"
				}}>
					<p className="cardName" style={{
						position: "absolute",
						textAlign: "left",
						lineHeight: `100%`,
						fontSize: `${dimensions.height / 3}%`,
						fontWeight: `900`,
						margin: `0`,
						marginTop: `0.6%`,
						marginLeft: `15%`,
						letterSpacing: `-${dimensions.width / 4000}rem`
					}}>
						Bidoof
					</p>
				</div>




				<div className="cardArtbox" style={{
					position: "relative",
					backgroundColor: "rgba(243, 245, 39, 0.43)",
					width: `${dimensions.width - (borderThickness)}px`,
					marginLeft: `${(borderThickness / 2)}px`,
					height: `${dimensions.height / 2.39}px`,
					display: "flex",
					justifyContent: "center"
				}}>
					<div className="cardArtFrame" style={{
						marginTop: `${(borderThickness / 10)}px`,
						
					}}>
						<img className="cardArtImage" src={testingArt} style={{
							width: `92%`,
							aspectRatio: `1106/696`
						}} />
					</div>
				</div>

				<div className="cardActions" style={{
					position: "relative",
					backgroundColor: "rgba(167, 236, 255, 0.43)",
					width: `${dimensions.width - (borderThickness)}px`,
					marginLeft: `${(borderThickness / 2)}px`,
					height: `${dimensions.height / 2.95}px`,
					display: "flex",
					justifyContent: "center"
				}}>


				</div>

				<div className="cardInfo" style={{
					position: "relative",
					backgroundColor: "rgba(255, 119, 25, 0.43)",
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
				<img src={testingImage} style={{
					zIndex: "-10",
					opacity: "0.3",
					position: "relative",
					height: "100%"
				}} />
			</div>
		</section>
	);
}
