
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
        <CardRenderer cardScale={cardScale} />
        <CardRenderer cardScale={cardScale} />
        <CardRenderer cardScale={cardScale} />
      </div>
    </div>
  )
}

export default App
