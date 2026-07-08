// src/components/HintRow.jsx
import { STATUS_COLORS } from '../utils/wordleLogic'

function HintCell({ value, status, arrow, width = "128px" }) {
  return (
    <div 
      className={`${STATUS_COLORS[status]} flex flex-col items-center justify-center rounded-lg p-2 h-16 text-white text-center flex-shrink-0 overflow-hidden`}
      style={{ width: width, minWidth: width, maxWidth: width }}
    >
      <p className="text-xs font-bold w-full text-center break-words">{value}</p>
      {arrow && <p className="text-lg">{arrow}</p>}
    </div>
  )
}

export function HintHeaders() {

  const headers = [
    { label: 'Name',        width: '195px' },
    { label: 'Era',         width: '112px' },
    { label: 'Set',         width: '176px' },
    { label: 'Price',       width: '96px'  },
    { label: 'Card Number', width: '96px' },
    { label: 'Rarity',      width: '128px' },
    { label: 'Type',        width: '120px'  },
  ]

  return (
    <div className="flex gap-2 items-center mb-2 w-full">
      <div style={{ width: '40px', minWidth: '40px' }} />
      {headers.map(({ label, width }) => (
        <div 
          key={label} 
          style={{ width, minWidth: width, maxWidth: width }}
          className="text-center text-xs text-gray-400 font-bold overflow-hidden"
        >
          {label}
        </div>
      ))}
    </div>
  )
}

function HintRow({ guess, hints }) {
  return (
    <div className="flex gap-2 items-center w-full">
      {/* Card image */}
      <img 
        src={guess.image} 
        alt={guess.name} 
        className="w-10 h-14 object-contain flex-shrink-0"
      />

      {/* Hint cells */}
      <HintCell value={hints.name.value}    status={hints.name.status}  width="192px"/>
      <HintCell value={hints.era.value}     status={hints.era.status} width="112px"/>
      <HintCell value={hints.set.value}     status={hints.set.status} width="176px"/>
      <HintCell value={hints.price.value}   status={hints.price.status} width="96px"  arrow={hints.price.arrow} />
      <HintCell value={hints.cardNumber.value} status={hints.cardNumber.status} width="96px"  arrow={hints.cardNumber.arrow} />
      <HintCell value={hints.rarity.value}     status={hints.rarity.status} width="128px"/>
      <HintCell value={hints.type.value}     status={hints.type.status} width="120px" />

    </div>
  )
}

export default HintRow