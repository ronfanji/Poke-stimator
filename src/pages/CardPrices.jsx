import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styled from 'styled-components'

const StyledButton = styled.button`
  position: absolute;
  height: 8%;
  width: 8%;
  top: 8%;
  left:3%;
  font-size: 2.6vmin;
  cursor: pointer;
  box-shadow: rgba(255, 255, 255, 0.05) 0px 3px 20px;
  border-width: initial;
  background-color: #f44336;
  color: white;
  border-style: none;
  border-color: initial;
  border-image: initial;
  outline: black;

  &:hover {
    background-color: #f11111;  /* change to whatever color you want */
  }
  `

function CardPrices() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggle, setToggle] = useState(6)
  const [selectedSet, setSelectedSet] = useState(null);
  const [activeEra, setActiveEra] = useState(6)

  // used to take a certain era
  function updateToggle(id){
    // the set only switches when the era changes (toggle)
    if (id !== toggle) {
      setSelectedSet(null) 
    }
    setToggle(id)
    setActiveEra(id)
  }

  useEffect(() => {
    async function fetchCards() {
      const { data, error } = await supabase
        .from('card_prices')
        .select('*')
        .eq('era_num', toggle)
        .order("set_num", { ascending: true})
        .order("price", { ascending: false })

      if (error) console.error(error)
      else setCards(data)
      
      setLoading(false)
    }

    fetchCards()
  }, [toggle])

    // Set to set_num 0 once cards load
    useEffect(() => {
      if (cards.length > 0 && !selectedSet) {
        const defaultSet = cards.find(card => card.set_num === 0)?.set
        setSelectedSet(defaultSet)
      }
    }, [cards])

  if (loading) return <p>Loading...</p>

  const groupedBySet = cards.reduce((acc, card) => {
    if(!acc[card.set]) acc[card.set] = []
    acc[card.set].push(card)
    return acc
  }, {})


  // if a set is selected, only show that set — otherwise show all
  const setsToDisplay = selectedSet
    ? { [selectedSet]: groupedBySet[selectedSet] }
    : {}


  return (

    <div className="min-h-screen bg-white flex flex-col items-center p-8">
      <div className='col-6 image p-5'>
        <ul className = "flex flex-wrap gap-3 mb-4 justify-center">
          <StyledButton onClick={() => navigate("/")}>Home</StyledButton>
          <button onClick={()=>updateToggle(1)} 
          className={activeEra === 1 
            ? 'bg-red-500 text-white hover:bg-red-500'           // active style
            : 'bg-white text-gray-900 hover:bg-red-50'  // inactive style
          }>Black & White</button>
          <button onClick={()=>updateToggle(2)}
          className={activeEra === 2 
            ? 'bg-red-500 text-white hover:bg-red-500'           // active style
            : 'bg-white text-gray-900 hover:bg-red-50'  // inactive style
          }>X & Y</button>

          <button onClick={()=>updateToggle(3)}
          className={activeEra === 3 
            ? 'bg-red-500 text-white hover:bg-red-500'           // active style
            : 'bg-white text-gray-900 hover:bg-red-50'  // inactive style
          }>Sun & Moon</button>

          <button onClick={()=>updateToggle(4)}
          className={activeEra === 4 
            ? 'bg-red-500 text-white hover:bg-red-500'           // active style
            : 'bg-white text-gray-900 hover:bg-red-50'  // inactive style
          }>Sword & Shield</button>

          <button onClick={()=>updateToggle(5)}
          className={activeEra === 5 
            ? 'bg-red-500 text-white hover:bg-red-500'           // active style
            : 'bg-white text-gray-900 hover:bg-red-50'  // inactive style
          }>Scarlet & Violet</button>

          <button onClick={()=>updateToggle(6)}
          className={activeEra === 6
            ? 'bg-red-500 text-white hover:bg-red-500'           // active style
            : 'bg-white text-gray-900 hover:bg-red-50'  // inactive style
          }>Mega Evolution</button>

          <button onClick={()=>updateToggle(100)}
          className={activeEra === 100 
            ? 'bg-red-500 text-white hover:bg-red-500'           // active style
            : 'bg-white text-gray-900 hover:bg-red-50'  // inactive style
          }>Sealed</button>
        </ul>

        {/* Set buttons — dynamically generated from current era's sets */}
        <ul className='flex flex-wrap gap-3 mb-8 justify-center'>
          {Object.keys(groupedBySet).map(set => (
            <button className= {selectedSet === set
              ? 'text-sm px-2 py-1 bg-red-500 text-white hover:bg-red-500'           // active style
              : 'text-sm px-2 py-1 bg-white text-gray-900 hover:bg-red-50'  // inactive style
            } 
            key={set} onClick={() => setSelectedSet(set)} >{set}</button>
          ))}
        </ul>

      </div>
      
      {Object.entries(setsToDisplay).map(([set, cards]) => (
        <div key={set} className="w-full max-w-6xl">
          <h2>{set}</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {cards.map(card => (
              <div key={card.id} style={{ width: "200px" }}>
                <section>
                  <img src={card.image} alt="" style={{ width: "100%" }} />
                  <p>{card.name}</p>
                  <p>${card.price}</p>
                </section>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  )
}

export default CardPrices