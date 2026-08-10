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
    
    const difficulties = [
        {
            title: 'Trainer',
            description: '$10-100',
            start: 'L'
        },
        {
            title: 'Team Rocket Grunt',
            description: '$100-500',
            start: 'M'
        },
        {
            title: 'Gym Leader',
            description: '$500-1500',
            start: 'H'
        },
        {
            title: 'Giovanni',
            description: '$1500+',
            start: 'S'
        },
    ]

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
        <div className="min-h-screen bg-white p-8">
            <h1>Estimate</h1>
            <p>Guess the value based on a percentage of a card's price</p>

            <div className="grid grid-cols-4 gap-6 px-8 pb-16 max-w-5xl mx-auto mt-6">
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
        <div className="min-h-screen bg-white flex flex-col items-center gap-2">
            <h1>Game Over!</h1>
            <p>Final Score: {Math.round(totalScore / NUM_PROBLEMS)}</p>

            <div className="flex flex-col gap-5 items-center">
                <button onClick={() => setRange(null)}>
                Play Again
                </button>
                <button 
                    onClick={() => navigate('/')} 
                    className="px-7 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
                    >
                    Back Home
                </button>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-white p-8">
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