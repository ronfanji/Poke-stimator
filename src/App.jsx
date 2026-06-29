import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CardPrices from './pages/CardPrices'
import UpperLower from './pages/UpperLower'
import Estimate from './pages/Estimate'
import UpperLowerEndless from './pages/UpperLowerEndless'
import Squirtle from './pages/Squirtle'

function App() {
  const [count, setCount] = useState(0)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card-prices" element={<CardPrices />} />
        <Route path="/upper-lower" element={<UpperLower />} />
        <Route path="/estimate" element={<Estimate />} />
        <Route path="/upper-lower-endless" element={<UpperLowerEndless />} />
        <Route path="/squirtle" element={<Squirtle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
