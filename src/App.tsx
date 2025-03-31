
import { useState } from 'react'
import './App.css'
import CardRenderer from './components/CardRenderer/CardRenderer'

function App() {
  let [cardScale, setCardScale] = useState("50");



  return (
    <div className='appContainer'>
      <div>
      <label htmlFor="cardScaleControl">Card Scale:</label>
      <input type="range" name="cardScaleControl" id="cardScaleControl" max={100} min={0} value={cardScale} onChange={(event) => setCardScale(event.currentTarget.value)} />
      </div>
      <div className='cardRendererContainer'>
        {new Array(8).fill("").map((_,index) => {
          return <CardRenderer key={"card0"+index} cardScale={cardScale} cardId={"card0" + (index+1).toString()} />
        })}
      </div>
    </div>
  )
}

export default App
