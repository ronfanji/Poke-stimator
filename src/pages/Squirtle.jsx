import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'

function CardWordle() {
  const [allCards, setAllCards] = useState([])
  const [input, setInput] = useState('')
  const [filtered, setFiltered] = useState([])
  const [selectedCard, setSelectedCard] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [targetCard, setTargetCard] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch all cards on load and pick a target
  useEffect(() => {
    async function fetchCards() {
      const { data, error } = await supabase
        .from('card_prices')
        .select('*')

      if (data) {
        setAllCards(data)
        // Pick a random target card
        const random = data[Math.floor(Math.random() * data.length)]
        setTargetCard(random)
      }
    }
    fetchCards()
  }, [])

  // Filter cards as user types
  useEffect(() => {
    if (input.length < 2) {
      setFiltered([])
      return
    }

    const results = allCards.filter(card =>
      card.name.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 10)  // limit to 10 results

    setFiltered(results)
  }, [input, allCards])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFiltered([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(card) {
    setSelectedCard(card)
    setInput(card.name)
    setFiltered([])  // close dropdown
  }

  function handleSubmit() {
    if (!selectedCard) return

    setGuesses(prev => [...prev, selectedCard])

    if (selectedCard.id === targetCard.id) {
      setGameOver(true)
    }

    // Reset input for next guess
    setInput('')
    setSelectedCard(null)
  }

  return (
    <div className="flex flex-col items-center p-8 gap-6">
      <h1 className="text-2xl font-bold">Pokemon Card Wordle</h1>

      {!gameOver && (
        <div className="flex flex-col gap-2 w-full max-w-md" ref={dropdownRef}>
          
          {/* Input */}
          <input
            type="text"
            value={input}
            onChange={e => {
              setInput(e.target.value)
              setSelectedCard(null)
            }}
            placeholder="Search for a card..."
            className="border-2 border-gray-400 rounded-lg px-3 py-2 bg-transparent text-black outline-none focus:border-blue-400"
          />

          {/* Dropdown */}
          {filtered.length > 0 && (
            <div className="border border-gray-600 rounded-lg overflow-hidden">
              {filtered.map(card => (
                <div
                  key={card.id}
                  onClick={() => handleSelect(card)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                >
                  <img src={card.image} alt={card.name} className="w-8 h-10 object-contain" />
                  <div>
                    <p className="text-sm font-medium">{card.name}</p>
                    <p className="text-xs text-gray-400">{card.set}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!selectedCard}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-4 py-2 rounded-lg transition"
          >
            Submit Guess
          </button>
        </div>
      )}

      {/* Previous guesses */}
      <div className="flex flex-col gap-2 w-full max-w-md">
        {guesses.map((guess, i) => (
          <div key={i} className="flex items-center gap-3 border border-gray-600 rounded-lg p-3">
            <img src={guess.image} alt={guess.name} className="w-10 h-14 object-contain" />
            <div>
              <p className="font-medium">{guess.name}</p>
              <p className="text-sm text-gray-400">{guess.set} — ${guess.price?.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Game over */}
      {gameOver && (
        <div className="text-center">
          <p className="text-2xl font-bold text-green-400">🎉 Correct!</p>
          <p>The card was {targetCard.name} from {targetCard.set}</p>
          <img src={targetCard.image} alt={targetCard.name} className="w-32 mx-auto mt-4" />
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-500 rounded-lg">
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default CardWordle