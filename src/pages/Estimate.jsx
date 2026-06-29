// src/pages/Estimate.jsx
import { useState, useEffect, useRef } from 'react'
import { useCardData } from '../hooks/useCardData'
import { generateEstimate, scoreEstimate, ESTIMATE_RANGES } from '../utils/gameLogic'
import { useNavigate } from 'react-router-dom'

const NUM_PROBLEMS = 5

function Estimate() {
    const navigate = useNavigate()
    const { productSorted, pricesSorted, imagesSorted, loading } = useCardData()
    const [range, setRange] = useState(null)
    const [problem, setProblem] = useState(null)
    const [guess, setGuess] = useState('')
    const [result, setResult] = useState(null)
    const [totalScore, setTotalScore] = useState(0)
    const [problemsLeft, setProblemsLeft] = useState(NUM_PROBLEMS)
    const [gameOver, setGameOver] = useState(false)
    const seenSet = useRef(new Set())

    function startGame(r) {
        seenSet.current.clear()
        setRange(r)
        setTotalScore(0)
        setProblemsLeft(NUM_PROBLEMS)
        setGameOver(false)
        setProblem(null)
        setProblem(generateEstimate(productSorted, pricesSorted, imagesSorted, r, seenSet.current))
        setResult(null)
        setGuess('')
    }

    function handleGuess() {
        const guessNum = parseFloat(guess)
        if (isNaN(guessNum)) return

        const points = scoreEstimate(guessNum, problem.correctPrice)
        setResult({ points, correctPrice: problem.correctPrice })
        setTotalScore(s => s + points)

        setProblemsLeft(p => p - 1)
    }

    function nextProblem() {
        if(problemsLeft == 0){
            setGameOver(true)
            return
        }
        setProblem(generateEstimate(productSorted, pricesSorted, imagesSorted, range, seenSet.current))
        setResult(null)
        setGuess('')
    }

    if (loading) return <p>Loading cards...</p>

    if (!range) return (
        <div>
            <h1>Estimate</h1>
            <p>Guess a percentage of a card's price</p>
            <button onClick={() => startGame('L')}>Low ($10-100)</button>
            <button onClick={() => startGame('M')}>Medium ($100-500)</button>
            <button onClick={() => startGame('H')}>High ($500-1500)</button>
            <button onClick={() => startGame('S')}>Super High ($1500+)</button>
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
            <p>Final Score: {Math.round(totalScore / NUM_PROBLEMS)}</p>
            <button onClick={() => setRange(null)}>Play Again</button>
        </div>
    )

    return (
        <div>
            <h2>Problems Left: {problemsLeft}</h2>

        {problem && !result && (
        <div className="flex flex-col items-center gap-2">
            <img src={problem.baseImage} alt="" />
            <p>What is {problem.percent}% of the {problem.baseProduct}?</p>
            <input
                type="number"
                value={guess}
                onChange={e => setGuess(e.target.value)}
                placeholder="Enter your estimate"
                className="border-2 border-gray-400 rounded-lg px-3 py-2 bg-transparent text-black outline-none focus:border-blue-400"
            />
            <button onClick={handleGuess}>Submit</button>
        </div>
        )}

        {result && (
            <div>
                <p>Correct Price: ${result.correctPrice.toFixed(2)}</p>
                <p>Points: {result.points}</p>
                <button onClick={nextProblem}>Next</button>
            </div>
        )}
        </div>
    )
}

export default Estimate