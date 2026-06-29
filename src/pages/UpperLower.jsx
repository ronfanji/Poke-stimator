import { useState } from 'react'
import { useCardData } from '../hooks/useCardData'
import { generateUpperLower } from '../utils/gameLogic'
import { useNavigate } from 'react-router-dom'

const NUM_PROBLEMS = 5

function UpperLower() {
    const navigate = useNavigate()
    const { productSorted, pricesSorted, imagesSorted, loading } = useCardData()
    const [difficulty, setDifficulty] = useState(null)
    const [problem, setProblem] = useState(null)
    const [result, setResult] = useState(null)
    const [score, setScore] = useState(0)
    const [problemsLeft, setProblemsLeft] = useState(NUM_PROBLEMS)
    const [gameOver, setGameOver] = useState(false)

    function startGame(diff){
        setDifficulty(diff)
        setScore(0)
        setProblemsLeft(NUM_PROBLEMS)
        setGameOver(false)
        nextProblem(diff, true)
    }

    function nextProblem(diff, isNewGame=false) {

        if(!isNewGame && problemsLeft == 0){
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
    
        setProblemsLeft(p => p - 1)
    }

    if (loading) return <p>Loading cards...</p>

    if (!difficulty) return (
        <div>
            <h1>Upper Lower</h1>
            <p>You are given two choices of Pokemon product. Select the item that is more expensive.</p>
            <button onClick={() => startGame('E')}>Easy</button>
            <button onClick={() => startGame('M')}>Medium</button>
            <button onClick={() => startGame('H')}>Hard</button>
            <footer>
                <button onClick={() => navigate('/')}>
                    Back Home
                </button>
            </footer>
        </div>
    )

    if (gameOver) return (
        <div>
            <h1>Game Over!</h1>
            <p>Score: {score} / {NUM_PROBLEMS}</p>
            <button onClick={() => setDifficulty(null)}>Play Again</button>
            <footer>
                <button onClick={() => navigate('/')}>
                    Home
                </button>
            </footer>
        </div>
    )
  
    return (
        <div>
            <h2>Score: {score} | Problems Left: {problemsLeft}</h2>
    
            {problem && !result && (
            <div>
                <p>Which is more expensive?</p>
                <div style={{ display: "flex", gap: "40px", justifyContent: "center", alignItems: "flex-start" }}>
                    <button onClick={() => handleAnswer(1)}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                            {problem.baseImage && <img src={problem.baseImage} alt={problem.baseProduct} style={{ width: "200px", height: "280px", objectFit: "contain" }}   />}
                        </div>
                        1. {problem.baseProduct}
                    </button>
                    <button onClick={() => handleAnswer(2)}>
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