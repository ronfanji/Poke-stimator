// src/utils/wordleLogic.js

export function getHints(guess, target) {
    return {
      name: {
        value: guess.name,
        status: guess.name === target.name ? 'correct' : 'wrong'
      },
      set: {
        value: guess.set,
        status: guess.set === target.set ? 'correct' : 'wrong'
      },
      era: {
        value: guess.era,
        status: guess.era === target.era 
          ? 'correct' 
          : guess.era_num === target.era_num 
            ? 'close' 
            : 'wrong'
      },
      price: {
        value: `$${guess.price?.toFixed(2)}`,
        status: guess.price === target.price
          ? 'correct'
          : Math.abs(guess.price - target.price) / target.price <= 0.20
            ? 'close'
            : 'wrong',
        arrow: guess.price < target.price ? '⬆️' : guess.price > target.price ? '⬇️' : null
      },
      set_num: {
        value: `Set #${guess.set_num}`,
        status: guess.set_num === target.set_num
          ? 'correct'
          : Math.abs(guess.set_num - target.set_num) <= 2
            ? 'close'
            : 'wrong',
        arrow: guess.set_num < target.set_num ? '⬆️' : guess.set_num > target.set_num ? '⬇️' : null
      }
    }
  }
  
  export const STATUS_COLORS = {
    correct: 'bg-green-500',
    close:   'bg-yellow-500',
    wrong:   'bg-gray-600'
  }