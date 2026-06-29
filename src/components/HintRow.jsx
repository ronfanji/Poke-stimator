// src/components/HintRow.jsx
import { STATUS_COLORS } from '../utils/wordleLogic'

function HintCell({ value, status, arrow }) {
  return (
    <div className={`${STATUS_COLORS[status]} flex flex-col items-center justify-center rounded-lg p-2 w-28 h-16 text-white text-center`}>
      <p className="text-xs font-bold truncate w-full text-center">{value}</p>
      {arrow && <p className="text-lg">{arrow}</p>}
    </div>
  )
}

export function HintHeaders() {
  return (
    <div className="flex gap-2 items-center mb-2">
      <div className="w-10" />  {/* spacer for image */}
      {['Name', 'Set', 'Era', 'Price', 'Set #'].map(label => (
        <div key={label} className="w-28 text-center text-xs text-gray-400 font-bold">
          {label}
        </div>
      ))}
    </div>
  )
}

function HintRow({ guess, hints }) {
  return (
    <div className="flex gap-2 items-center">
      {/* Card image */}
      <img 
        src={guess.image} 
        alt={guess.name} 
        className="w-10 h-14 object-contain"
      />

      {/* Hint cells */}
      <HintCell value={hints.name.value}    status={hints.name.status} />
      <HintCell value={hints.set.value}     status={hints.set.status} />
      <HintCell value={hints.era.value}     status={hints.era.status} />
      <HintCell value={hints.price.value}   status={hints.price.status}   arrow={hints.price.arrow} />
      <HintCell value={hints.set_num.value} status={hints.set_num.status} arrow={hints.set_num.arrow} />
    </div>
  )
}

export default HintRow