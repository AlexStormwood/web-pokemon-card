
import { useState } from 'react'
import './App.css'
import CardRenderer from './components/CardRenderer/CardRenderer'

function App() {
  let [cardScale, setCardScale] = useState("50");
  let [debugViewEnabled, setDebugViewEnabled] = useState(true);


  return (
    <div className='appContainer'>
      <div>
      <label htmlFor="cardScaleControl">Card Scale:</label>
      <input type="range" name="cardScaleControl" id="cardScaleControl" max={100} min={0} value={cardScale} onChange={(event) => setCardScale(event.currentTarget.value)} />
      </div>
      <div>
      <label htmlFor="debugViewControl">Debug View:</label>
      <input type="checkbox" name="debugViewControl" id="debugViewControl" checked={debugViewEnabled} value={"true"} onChange={(event) => setDebugViewEnabled(event.currentTarget.checked)} />
      </div>
      <div className='cardRendererContainer'>
        {new Array(8).fill("").map((_,index) => {
          return <CardRenderer key={"card0"+index} cardScale={cardScale} cardId={"card0" + (index+1).toString()} debugViewEnabled={debugViewEnabled} />
        })}
      </div>
    </div>
  )
}

export default App
