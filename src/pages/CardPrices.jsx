import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import styled from 'styled-components'

const StyledButton = styled.button`
  position: absolute;
  height: 8%;
  width: 8%;
  top: 2.5%;
  left:5%;
  font-size: 2.6vmin;
  cursor: pointer;
  box-shadow: rgba(255, 255, 255, 0.05) 0px 3px 20px;
  border-width: initial;
  background-color: grey;
  color: white;
  border-style: none;
  border-color: initial;
  border-image: initial;
  outline: none;
  `

function CardPrices() {
  const navigate = useNavigate()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [toggle, setToggle] = useState(6)
  const [selectedSet, setSelectedSet] = useState(null);

  // used to take a certain era
  function updateToggle(id){
    // the set only switches when the era changes (toggle)
    if (id !== toggle) {
      setSelectedSet(null) 
    }
    setToggle(id)
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

    <div className='d-flex align-items-center justify-content-center'>
      <div className='col-6 image p-5'>
        <ul className = 'd-flex list-unstyled gap-3 m-0 mb-4'>
          <StyledButton onClick={() => navigate("/")}>Home</StyledButton>
          <button onClick={()=>updateToggle(1)}>Black & White</button>
          <button onClick={()=>updateToggle(2)}>X & Y</button>
          <button onClick={()=>updateToggle(3)}>Sun & Moon</button>
          <button onClick={()=>updateToggle(4)}>Sword & Shield</button>
          <button onClick={()=>updateToggle(5)}>Scarlet & Violet</button>
          <button onClick={()=>updateToggle(6)}>Mega Evolutions</button>
          <button onClick={()=>updateToggle(100)}>Sealed</button>
        </ul>

        {/* Set buttons — dynamically generated from current era's sets */}
        <ul className='d-flex list-unstyled gap-3 m-0'>
          {Object.keys(groupedBySet).map(set => (
            <button key={set} onClick={() => setSelectedSet(set)} className='text-sm px-2 py-1'>{set}</button>
          ))}
        </ul>

      </div>

      {Object.entries(setsToDisplay).map(([set, cards]) => (
        <div key={set}>
          <h2>{set}</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
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