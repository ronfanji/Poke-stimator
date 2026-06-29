
import { useNavigate } from 'react-router-dom'
import '../index.css'

function Home() {
    const navigate = useNavigate()
  
    return (
      <div>
        <h1>Poké-stimator</h1>
        <section>
          Welcome to the trade, fellow collector! Here, we provide trials to test your ability to gauge and estimate Pokemon prices.
        </section>
        
        <button onClick={() => navigate('/card-prices')}>
          View Prices
        </button>
        <button onClick={() => navigate('/upper-lower')}>
          High Low
        </button>
        <button onClick={() => navigate('/upper-lower-endless')}>
          High Low Endless Mode
        </button>
        <button onClick={() => navigate('/estimate')}>
          Trade Estimation
        </button>
        <button onClick={() => navigate('/squirtle')}>
          Squirtle
        </button>
      </div>
    )
  }
  
  export default Home