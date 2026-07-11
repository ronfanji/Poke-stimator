// src/utils/wordleLogic.js

// cards whose types are weak/strong against are considered close
const type_strengths= {
  'Fire':     ['Grass', 'Bug', 'Ice', 'Steel'],        
  'Water':    ['Fire', 'Ground', 'Rock'],       
  'Grass':    ['Water', 'Ground', 'Rock'],       
  'Electric': ['Water', 'Flying'],               
  'Psychic':  ['Fighting', 'Poison'],          
  'Fighting': ['Normal', 'Ice', 'Dark', 'Rock', 'Steel'],
  'Dark':     ['Psychic', 'Ghost'],
  'Steel':    ['Ice', 'Rock', 'Fairy'],
  'Fairy':    ['Fighting', 'Dragon', 'Dark'],
  'Dragon':   ['Dragon'],
  'Ghost':    ['Psychic', 'Ghost'],
  'Ice':      ['Grass', 'Flying', 'Dragon', 'Ground'],
  'Ground':   ['Fire', 'Electric', 'Poison', 'Rock', 'Steel'],
  'Flying':   ['Grass', 'Fighting', 'Bug'],
  'Rock':     ['Fire', 'Flying', 'Bug', 'Ice'],
  'Poison':   ['Grass', 'Fairy'],
  'Bug':      ['Grass', 'Psychic', 'Dark'],
  'Normal':   [],
}

function typesAreClose(guessEnergy, targetEnergy) {
  if (!guessEnergy || !targetEnergy) return false
  
  const guessClose = type_strengths[guessEnergy] ?? []
  const targetClose = type_strengths[targetEnergy] ?? []

  // check if guess type is a strength or weakness against target type
  return guessClose.includes(targetEnergy) || targetClose.includes(guessEnergy)
}


export function getHints(guess, target) {
    return {
      name: {
        value: guess.name,
        status: guess.name === target.name ? 'correct' : 'wrong'
      },
      set: {
        value: guess.set,
        status: guess.set === target.set ? 'correct' : 'wrong',
      },
      set_num: {
        value: guess.set_num,
        status: guess.set_num === target.set_num ? 'correct'
                : Math.abs(guess.set_num - target.set_num) <= 2 ? 'close' : 'wrong',
        arrow: guess.set_num < target.set_num ? '⬆️' : guess.set_num > target.set_num ? '⬇️' : null
      },
      era: {
        value: guess.era,
        status: guess.era === target.era 
          ? 'correct' 
          : guess.era_num + 1 === target.era_num || guess.era_num - 1 === target.era_num
            ? 'close' 
            : 'wrong'
      },
      price: {
        value: `$${guess.price?.toFixed(2)}`,
        status: guess.price === target.price
          ? 'correct'
          : Math.abs(guess.price - target.price) <= 0.125 * target.price // determines the threshold for closeness in price
            ? 'close'
            : 'wrong',
        arrow: guess.price < target.price ? '⬆️' : guess.price > target.price ? '⬇️' : null
      },
      cardNumber: {
        value: guess.cardNumber,
        status: (() => {
          if(guess.cardNumber === target.cardNumber) return 'correct'

          // extract numeric sections
          const guessNum = parseInt(guess.cardNumber?.replace(/[^0-9]/g, ''))
          const targetNum = parseInt(target.cardNumber?.replace(/[^0-9]/g, ''))
          
          // Check if numeric parts are close (within 3)
          const numsAreClose = !isNaN(guessNum) && !isNaN(targetNum) && Math.abs(guessNum - targetNum) <= 3
          
          return numsAreClose ? 'close' : 'wrong'
        })(),
        arrow: (() => {
          const guessNum = parseInt(guess.cardNumber?.replace(/[^0-9]/g, ''))
          const targetNum = parseInt(target.cardNumber?.replace(/[^0-9]/g, ''))

          if(guessNum === targetNum) return null

          return guessNum < targetNum ? '⬆️' : '⬇️'
        })()
      },
      rarity: {
        value: guess.rarity,
        status: (() => {
          if(guess.rarity === target.rarity) return 'correct'

          const guessWords = guess.rarity?.toLowerCase().split(' ') ?? []
          const targetWords = target.rarity?.toLowerCase().split(' ') ?? []

          const hasSharedWord = guessWords.some(word => targetWords.includes(word))

          return hasSharedWord ? 'close' : 'wrong'
        })()
      },
      type: {
        value: guess.type ?? 'None',
        status: (() => {
          if(guess.type === target.type) return 'correct'
          if(typesAreClose(guess.type, target.type)) return 'close'
          return 'wrong' 
        })()
      }


    }
  }
  
  export const STATUS_COLORS = {
    correct: 'bg-green-500',
    close:   'bg-yellow-500',
    wrong:   'bg-red-600'
  }