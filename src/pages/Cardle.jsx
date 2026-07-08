// src/pages/CardWordle.jsx
import { useState, useEffect, useRef } from 'react'
import { getHints } from '../utils/wordleLogic'
import HintRow, { HintHeaders } from '../components/HintRow'
import { useCardDataCardle } from '../hooks/useCardData'

const MAX_GUESSES = 8

function CardWordle() {
  const {allCards} = useCardDataCardle()
  const [input, setInput] = useState('')
  const [filtered, setFiltered] = useState([])
  const [selectedSet, setSelectedSet] = useState(null)
  const [selectedCard, setSelectedCard] = useState(null)
  const [guesses, setGuesses] = useState([])
  const [targetCard, setTargetCard] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const dropdownRef = useRef(null)


  useEffect(() => {
    if (allCards.length > 0 && !targetCard) {
      const random = allCards[Math.floor(Math.random() * allCards.length)]
      setTargetCard(random)
    }
  }, [allCards])


  useEffect(() => {
    if (input.length < 2) { setFiltered([]); return }
    const results = allCards
      .filter(card => card.name.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 10)
    setFiltered(results)
  }, [input, allCards])

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
    setFiltered([])
  }

  function handleSubmit() {
    if (!selectedCard || !targetCard) return

    // Build the hints comparing guess to target
    const hints = getHints(selectedCard, targetCard)
    const newGuess = { ...selectedCard, hints }
    const newGuesses = [...guesses, newGuess]
    setGuesses(newGuesses)

    if (selectedCard.id === targetCard.id) {
      setWon(true)
      setGameOver(true)
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameOver(true)
    }

    setInput('')
    setSelectedCard(null)
  }

  return (
    <div className="flex flex-col items-center p-8 gap-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-white">CARDLE</h1>
      <p className="text-gray-400">Guess the mystery card in {MAX_GUESSES} tries</p>

      {/* Color legend */}
      <div className="flex gap-4 text-sm text-gray-400">
        <span><span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"/>Correct</span>
        <span><span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-1"/>Close</span>
        <span><span className="inline-block w-3 h-3 bg-red-600 rounded mr-1"/>Wrong</span>
      </div>

      {/* Guess history with hints */}
      {guesses.length > 0 && (
        <div className="flex flex-col gap-2 w-full px-4">
          <HintHeaders />
          {guesses.map((guess, i) => (
            <HintRow key={i} guess={guess} hints={guess.hints} />
          ))}
        </div>
      )}

      {/* Input */}
      {!gameOver && (
        <div className="flex flex-col gap-2 w-full max-w-md" ref={dropdownRef}>
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setSelectedCard(null) }}
            placeholder="Search for a card..."
            className="border-2 border-gray-400 rounded-lg px-3 py-2 bg-transparent text-white outline-none focus:border-blue-400"
          />

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

          <button
            onClick={handleSubmit}
            disabled={!selectedCard}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition"
          >
            Submit Guess ({guesses.length}/{MAX_GUESSES})
          </button>
        </div>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="text-center flex flex-col items-center gap-4">
          {won 
            ? <p className="text-2xl font-bold text-green-400">🎉 You got it in {guesses.length} guesses!</p>
            : <p className="text-2xl font-bold text-red-400">❌ Out of guesses!</p>
          }
          <p className="text-gray-300">The card was:</p>
          <img src={targetCard.image} alt={targetCard.name} className="w-32" />
          <p className="font-bold">{targetCard.name}</p>
          <p className="text-gray-400">{targetCard.set} — ${targetCard.price?.toFixed(2)}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default CardWordle