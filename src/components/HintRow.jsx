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
    { label: 'Name',        width: '13%' },
    { label: 'Era',         width: '13.25%' },
    { label: 'Set',         width: '16%' },
    { label: 'Set Num',     width: '8%' },
    { label: 'Price',       width: '12%'  },
    { label: 'Card Number', width: '10%' },
    { label: 'Rarity',      width: '12%' },
    { label: 'Type',        width: '7%'  },
  ]

  return (
    <div className="flex gap-2 items-center mb-2 w-full">
      <div style={{ width: '40px', minWidth: '40px', flexShrink: 0 }} />
      {headers.map(({ label, width }) => (
        <div 
          key={label} 
          style={{ width, minWidth: width, maxWidth: width, flexShrink: 0 }}
          className="text-center text-xs text-gray-700 font-bold overflow-hidden"
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
      <HintCell value={hints.name.value}    status={hints.name.status}  width="13%"/>
      <HintCell value={hints.era.value}     status={hints.era.status} width="13%"/>
      <HintCell value={hints.set.value}     status={hints.set.status} width="16%"/>
      <HintCell value={hints.set_num.value} status={hints.set_num.status} arrow={hints.set_num.arrow} width="8%"/>
      <HintCell value={hints.price.value}   status={hints.price.status} width="12%"  arrow={hints.price.arrow} />
      <HintCell value={hints.cardNumber.value} status={hints.cardNumber.status} width="10%"  arrow={hints.cardNumber.arrow} />
      <HintCell value={hints.rarity.value}     status={hints.rarity.status} width="12%"/>
      <HintCell value={hints.type.value}     status={hints.type.status} width="7%" />

    </div>
  )
}

export default HintRow