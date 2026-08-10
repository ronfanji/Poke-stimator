import { useState } from 'react'
import { useCardData } from '../hooks/useCardData'
import { generateUpperLower } from '../utils/gameLogic'
import { useNavigate } from 'react-router-dom'

const MAX_LIVES = 3

function UpperLower() {
    const navigate = useNavigate()
    const { productSorted, pricesSorted, imagesSorted, loading } = useCardData()
    const [difficulty, setDifficulty] = useState(null)
    const [problem, setProblem] = useState(null)
    const [result, setResult] = useState(null)
    const [score, setScore] = useState(0)
    const [lives, setLives] = useState(MAX_LIVES)
    const [gameOver, setGameOver] = useState(false)
    const [wrongAnswer, setWrong] = useState(false)

    const difficulties = [
        {
            title: 'Easy',
            description: 'Fellow Collectors',
            start: 'E'
        },
        {
            title: 'Medium',
            description: 'Experienced Hobbyists',
            start: 'M'
        },
        {
            title: 'Hard',
            description: 'Only for the Most Dedicated of Traders',
            start: 'H'
        },
    ]


    function startGame(diff){
        setDifficulty(diff)
        setScore(0)
        setGameOver(false)
        nextProblem(diff)
        setLives(MAX_LIVES)
    }

    function nextProblem(diff) {
        if(lives === 0){
            setGameOver(true)
            return
        }
        const p = generateUpperLower(productSorted, pricesSorted, imagesSorted, diff || difficulty)
        setProblem(p)
        setResult(null)
    }

    function handleAnswer(choice) {
        const { basePrice, secondPrice } = problem
        const correct = choice === 1 ? basePrice >= secondPrice : secondPrice >= basePrice
    
        setResult({ correct, basePrice, secondPrice })
        if (correct) setScore(s => s + 1)
        else setLives(l => l - 1)
    }

    function LivesDisplay({ lives, max }) {
        return (
          <div className="flex gap-2">
            {Array.from({ length: max }).map((_, i) => (
              <span key={i} style={{ fontSize: '28px', opacity: i < lives ? 1 : 0.2 }}>
                LIFE
              </span>
            ))}
          </div>
        )
    }

    if (loading) return <p>Loading cards...</p>

    if (!difficulty) return (
        <div className="min-h-screen bg-white p-8">
            <h1>High Low Endless</h1>
            <p>You are given two choices of Pokemon product. Select the item that is more expensive!</p>
            <p className = 'mb-4'>Continue playing until you get one wrong!</p>

            {/* Difficulty Cards */}
            <div className="grid grid-cols-3 gap-6 px-8 pb-16 max-w-4xl mx-auto mt-6">
                {difficulties.map(diff => (
                <div
                    key={diff.start}
                    onClick={() => startGame(diff.start)}
                    className="bg-white hover:bg-red-50 border border-gray-200 hover:border-red-400 rounded-xl p-6 cursor-pointer transition flex flex-col gap-3 shadow-sm"
                >
                    <h3 className="text-xl font-bold text-gray-900">{diff.title}</h3>
                    <p className="text-gray-500 text-sm">{diff.description}</p>
                </div>
                ))}
            </div>

            <footer>
                <button onClick={() => navigate('/')} 
                className="px-7 py-5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition">
                    Back Home
                </button>
            </footer>
        </div>
    )

    if (gameOver) return (
        <div className="min-h-screen bg-white flex flex-col items-center gap-5">
            <h1>Game Over!</h1>
            <p>Score: {score}</p>
            
            <div
                onClick={() => setDifficulty(null)}
                className="bg-white hover:bg-red-50 border border-gray-200 hover:border-red-400 rounded-xl p-6 cursor-pointer transition flex flex-col gap-3 shadow-sm w-48 mx-auto"
            >
                <h3 className="text-xl font-bold text-gray-900">Play Again</h3>
            </div>

            <footer>
                <button onClick={() => navigate('/')} 
                className="px-7 py-5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition">
                    Back Home
                </button>
            </footer>
            
        </div>
    )
  
    return (
        <div className="min-h-screen bg-white">
            <h2>Score: {score}</h2>
            <LivesDisplay lives={lives} max={MAX_LIVES} />
            {problem && !result && (
            <div>
                <p>Which is more expensive?</p>
                <div style={{ display: "flex", gap: "40px", justifyContent: "center", alignItems: "flex-start" }}>
                <button onClick={() => handleAnswer(1)} >
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            {problem.baseImage && <img src={problem.baseImage} alt={problem.baseProduct} style={{ width: "200px", height: "280px", objectFit: "contain" }}   />}
                        </div>
                        1. {problem.baseProduct}
                    </button>
                    <button onClick={() => handleAnswer(2)}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            {problem.secondImage && problem.secondImage.map((src, i) => (
                                <img 
                                key={i} 
                                src={src} 
                                alt={`option 2 card ${i + 1}`} 
                                style={{ width: "200px", height: "280px", objectFit: "contain" }}
                                />
                            ))}
                        </div>
                        2. {problem.secondProduct}
                    </button>
                </div>
            </div>
        )}
    
        {result && (
            <div className="flex flex-col items-center gap-2">
                <p>{result.correct ? '✅ Correct!' : '❌ Wrong!'}</p>
                <p>Option 1: {problem.baseProduct} — ${result.basePrice.toFixed(2)}</p>
                {problem.baseImage && <img src={problem.baseImage} alt={problem.baseProduct} style={{ width: "200px", height: "280px", objectFit: "contain" }} />}
                <p>Option 2: {problem.secondProduct} — ${result.secondPrice.toFixed(2)}</p>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                {problem.secondImage.map((src, i) => (
                    <img 
                        key={i} 
                        src={src} 
                        alt={`option 2 card ${i + 1}`} 
                        style={{ width: "200px", height: "280px", objectFit: "contain" }}
                    />
                ))}
                </div>
                <button onClick={() => nextProblem()}>Next</button>
            </div>
        )}
    </div>
    )
  }
  
  export default UpperLower