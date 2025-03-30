import "./CardRenderer.css";

import testingImage from "../../assets/cPK_10_005040_00_BIPPA_C_M_en_US_UT.png";
import testingArt from "../../assets/cPK_10_005040_00_BIPPA_C_L_ILL.png";

export const themes = {
	pocket: {},
};

export default function CardRenderer() {
	return (
		<section className="cardRenderer">
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
