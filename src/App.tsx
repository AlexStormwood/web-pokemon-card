
import { useEffect, useState } from 'react'
import CardRenderer from '../lib';
import { CardRendererProps } from '../lib/components/CardRenderer/CardRenderer.types';

function App() {
  let [cardScale, setCardScale] = useState("50");
  let [debugViewEnabled, setDebugViewEnabled] = useState(true);
  let [cardRenderingData, setCardRenderingData] = useState<CardRendererProps[]>([]);

  useEffect(() => {
    const importAssets = async (cardId: string) => {
			// So, realistically, replace this function with something that
			// fetches the image URLs from the server.
			// It'd help remove the need for that DynamicImportType in the state declarations, too.
      let targetCardArts: string[] = [];
			try {
        const targetCardArtBg:{ default: string } = await import(
          `./assets/debug/${cardId}/art-bg.png`
        );
        targetCardArts.push(targetCardArtBg.default);
        const targetCardArtFg:{ default: string } = await import(
          `./assets/debug/${cardId}/art-fg.png`
        );
        targetCardArts.push(targetCardArtFg.default);

      } catch (error) {
        const targetCardArt:{ default: string } = await import(
          `./assets/debug/${cardId}/art.png`
        );
        targetCardArts.push(targetCardArt.default);
      }

			const targetCardDebugImage:{ default: string } = await import(
				`./assets/debug/${cardId}/card.png`
			);

			const targetCardData:{ default: string }  = await import(
				`./assets/debug/${cardId}/data.json`
			);
      let cardDataLocal = JSON.parse(JSON.stringify(targetCardData.default));
      cardDataLocal.imageUrls = [...targetCardArts];
			
      let cardPropsToStore: CardRendererProps = {
        targetCardData: cardDataLocal,
        targetDebugViewEnabled: debugViewEnabled,
        targetCardDebugImage: targetCardDebugImage.default,
        targetCardScale: cardScale
      }
      
      return cardPropsToStore;
		};

    const prepCardRange = async () => {
      let cardRange = new Array(8).fill("");
      let cardDataPrepped: CardRendererProps[] = [];
      for (let index = 0; index < cardRange.length; index++) {
        let result = await importAssets("card0" + (index+1).toString());
        cardDataPrepped.push(result);
      }

      setCardRenderingData(cardDataPrepped);
    }

    prepCardRange();
		
  }, []);


  useEffect(() => {
    
    setCardRenderingData(previousData => {
      let newData = previousData.map((individualCardData) => {
        let newProps: CardRendererProps = {...individualCardData};
        newProps.targetCardScale = cardScale;
        newProps.targetDebugViewEnabled = debugViewEnabled;
        return newProps;
      });
      return newData;
    })
  }, [debugViewEnabled, cardScale]);

  return (
    <div className='appContainer'  style={{display: "flex", flexDirection: "column", height: "100dvh"}}>
      <div>
      <label htmlFor="cardScaleControl">Card Scale:</label>
      <input type="range" name="cardScaleControl" id="cardScaleControl" max={100} min={0} value={cardScale} onChange={(event) => setCardScale(event.currentTarget.value)} />
      </div>
      <div>
      <label htmlFor="debugViewControl">Debug View:</label>
      <input type="checkbox" name="debugViewControl" id="debugViewControl" checked={debugViewEnabled} value={"true"} onChange={(event) => setDebugViewEnabled(event.currentTarget.checked)} />
      </div>
      <div className='cardRendererContainer'  style={{display: "flex", flexWrap: "wrap"}}>
        {cardRenderingData.map((dataObj,index) => {
          return <CardRenderer key={"card0"+index} {...dataObj} />
        })}
      </div>
    </div>
  )
}

export default App
