import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const games = [
    {
      title: 'High Low',
      description: 'Which Pokemon product is more expensive? Test your market knowledge.',
      route: '/upper-lower',
      emoji: '⬆️⬇️'
    },
    {
      title: 'High Low Endless',
      description: 'Keep going until you get one wrong.',
      route: '/upper-lower-endless',
      emoji: '♾️'
    },
    {
      title: 'Trade Estimation',
      description: 'Based on a given percentage and a card, guess the resulting price.',
      route: '/estimate',
      emoji: '💰'
    },
    {
      title: 'Cardle',
      description: 'Guess the mystery Pokemon card in 10 tries.',
      route: '/cardle',
      emoji: '🃏'
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <h1 className="text-4xl font-bold text-gray-900">Poké-stimator</h1>
        <button
          onClick={() => navigate('/card-prices')}
          className="px-5 py-5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition"
        >
          View Card Prices
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center text-center px-8 py-16 gap-4">
        <h2 className="text-5xl font-bold text-gray-900">Test your Collector Knowledge!</h2>
        <p className="text-xl text-gray-500 max-w-xl">
          Welcome to the trade, fellow collector! Test your ability to gauge and estimate Pokemon card prices across multiple game modes.
        </p>
        <p className="text-sm text-gray-500 max-w-xl">
          p.s.: this is just a fun little game, not a testament to how well you actually know your cards :D
        </p>
      </div>

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 pb-16 max-w-4xl mx-auto">
        {games.map(game => (
          <div
            key={game.route}
            onClick={() => navigate(game.route)}
            className="bg-white hover:bg-red-50 border border-gray-200 hover:border-red-400 rounded-xl p-6 cursor-pointer transition flex flex-col gap-3 shadow-sm"
          >
            <p className="text-4xl">{game.emoji}</p>
            <h3 className="text-xl font-bold text-gray-900">{game.title}</h3>
            <p className="text-gray-500 text-sm">{game.description}</p>
            <p className="text-red-500 text-sm font-medium mt-auto">Play →</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-400 text-sm pb-8">
        Prices sourced from TCGPlayer — updated every 8 hours
      </div>

    </div>
  )
}

export default Home