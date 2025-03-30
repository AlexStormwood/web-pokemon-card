import "./CardRenderer.css";

import testingImage from "../../assets/cPK_10_005040_00_BIPPA_C_M_en_US_UT.png";
import testingArt from "../../assets/cPK_10_005040_00_BIPPA_C_L_ILL.png";
import { useEffect, useRef, useState } from "react";

export const themes = {
	pocket: {},
};

export default function CardRenderer({cardScale}: {cardScale: string}) {

	const refContainer = useRef<HTMLElement>(null);
	const [dimensions, setDimensions] = useState({
		width: 0, height: 0
	});



	useEffect(() => {
		if (refContainer.current) {
			setDimensions({
				width: refContainer.current.offsetWidth,
				height: refContainer.current.offsetHeight
			})
		}
	}, [])

	let [x, setX] = useState("0");
	let [y, setY] = useState("0");

	const rotateToMouse = (event: React.MouseEvent) => {
		const baseX = event.clientX;
		const baseY = event.clientY;
		const middleX = dimensions.width / 2;
		const middleY = dimensions.height / 2;
		const offsetX = ((baseX - middleX) / middleX) * 45;
		const offsetY = ((baseY - middleY) / middleY) * 45;

		setX( -1 * offsetY + "deg");
		setY(offsetX + "deg");
	}

	const resetRotationAfterDelay = () => {
		setTimeout(() => {
			setX("0deg");
			setY("0deg");
		}, 1000);
	}


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
			<div className="cardContent">
				<div className="cardHeader">
					<p className="cardName">Bidoof</p>
				</div>
				<div className="cardArtbox">
					<img className="cardArtImage" src={testingArt} />
				</div>
				<div className="cardBorder">
					<svg
						className="cardHollow"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect />
					</svg>
				</div>
			</div>
			<div className="debugHelpers">
				<img src={testingImage} />
			</div>
		</section>
	);
}
