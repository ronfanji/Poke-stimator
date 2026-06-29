// src/utils/gameLogic.js

export const DIFFICULTIES = {
    E: { percent: 0.25, threshold: 0.10, weights: [0.8, 0.2, 0] },
    M: { percent: 0.15, threshold: 0.05,  weights: [0.6, 0.3, 0.1] },
    H: { percent: 0.10, threshold: 0.01, weights: [0.475, 0.375, 0.15] }
  }
  
export const ESTIMATE_RANGES = {
    L: { percent: 80, low: 10,   high: 100,   weights: [1, 0, 0] },
    M: { percent: 85, low: 100,  high: 500,   weights: [0.6, 0.3, 0.1] },
    H: { percent: 90, low: 500,  high: 1500,  weights: [0.475, 0.375, 0.15] },
    S: { percent: 92, low: 1500, high: 100000, weights: [0.475, 0.375, 0.15] }
  }
  
// binary search function
function binarySearch(arr, target) {
  let left = 0
  let right = arr.length - 1
   while (left < right) {
    const mid = Math.floor((left + right) / 2)
    if (arr[mid] < target) left = mid + 1
    else right = mid
  }
  return left
}
  
// Generates one Upper Lower problem
export function generateUpperLower(productSorted, pricesSorted, imagesSorted, difficulty) {
  const { percent, threshold, weights } = DIFFICULTIES[difficulty]
  const size = productSorted.length
  
  // Keep trying until we find a valid problem
  for (let attempts = 0; attempts < 1000; attempts++) {
    const baseIndex = Math.floor(Math.random() * size)
    const baseProduct = productSorted[baseIndex]
    const basePrice = pricesSorted[baseIndex]
    const baseImage = imagesSorted[baseIndex]
  
    const weight = Math.random()
    let pickSet = []
    let secondProduct, secondPrice, secondImage, secondIndex
  
    // Single card comparison: only pick a single card
    // pretty simple logic - simply check all cards greater and less than basePrice, add all elements that are within range,
    // then pick a random index
    if (weight < weights[0]) {
      for (let i = baseIndex - 1; i >= 0; i--) {
        const diff = basePrice - pricesSorted[i]
        if (diff <= percent * basePrice && diff >= threshold * basePrice) pickSet.push(i)
        else if (diff > percent * basePrice) break
      }
      for (let i = baseIndex + 1; i < size; i++) {
        const diff = pricesSorted[i] - basePrice
        if (diff <= percent * basePrice && diff >= threshold * basePrice) pickSet.push(i)
        else break
      }
      if (pickSet.length === 0) continue
  
      secondIndex = pickSet[Math.floor(Math.random() * pickSet.length)]
      secondProduct = productSorted[secondIndex]
      secondPrice = pricesSorted[secondIndex]
      secondImage = [imagesSorted[secondIndex]]
  
    // Two card sum
    // iterates through all possible 2-sum values and only adds the sets of prices that add up 
    // within the threshold of basePrice
    } else if (weight < weights[0] + weights[1]) {
      for (let i = 0; i < baseIndex; i++) {
        for (let j = baseIndex - 1; j >= i; j--) {
          const sum = pricesSorted[i] + pricesSorted[j]
          const diff = Math.abs(sum - basePrice)
          if (diff <= percent * basePrice && diff >= threshold * basePrice) {
            pickSet.push([i, j])
          }
        }
      }
      if (pickSet.length === 0) continue
  
      secondIndex = pickSet[Math.floor(Math.random() * pickSet.length)]
      secondProduct = `${productSorted[secondIndex[0]]} and ${productSorted[secondIndex[1]]}`
      secondPrice = pricesSorted[secondIndex[0]] + pricesSorted[secondIndex[1]]
      secondImage = [imagesSorted[secondIndex[0]], imagesSorted[secondIndex[1]]]
  
    // Three card sum
    // most complicated but more efficient: 
    // double iterate through like two card sum, but to find the third card, use binary search to find lower and 
    // upper bounds to the base price. Then, take a random list out of pickSet
    } else {
      for (let i = 0; i < baseIndex; i++) {
        for (let j = i; j < baseIndex; j++) {
          if (pricesSorted[i] + pricesSorted[j] * 2 > basePrice) break

          const lowerTarget = (1 - percent) * basePrice - pricesSorted[i] - pricesSorted[j]
          const upperTarget = (1 + percent) * basePrice - pricesSorted[i] - pricesSorted[j]
  
          const lowerInd = binarySearch(pricesSorted.slice(j, baseIndex), lowerTarget) + j
          const upperInd = binarySearch(pricesSorted.slice(j, baseIndex), upperTarget) + j
  
          for (let k = lowerInd; k <= upperInd && k < baseIndex; k++) {
            const sum = pricesSorted[i] + pricesSorted[j] + pricesSorted[k]
            const diff = Math.abs(sum - basePrice)
            if (diff <= percent * basePrice && diff >= threshold * basePrice) {
              pickSet.push([i, j, k])
            }
          }
        }
      }

      // if pickSet empty, skip
      if (pickSet.length === 0) continue
      
      // pick a random index in pickSet
      secondIndex = pickSet[Math.floor(Math.random() * pickSet.length)]
      secondProduct = secondIndex.map(i => productSorted[i]).join(', ')
      secondPrice = secondIndex.reduce((sum, i) => sum + pricesSorted[i], 0)
      secondImage = [imagesSorted[secondIndex[0]], imagesSorted[secondIndex[1]], imagesSorted[secondIndex[2]]]
    }
  
    return { baseProduct, basePrice, baseImage, secondProduct, secondPrice, secondImage, secondIndex }
  }
  
  return null // couldn't find a valid problem
}
  
// Generates one Estimate problem
export function generateEstimate(productSorted, pricesSorted, imagesSorted, range, seenSet) {
  const { percent, low, high } = ESTIMATE_RANGES[range]
  const size = productSorted.length
  
  const lowIndex = binarySearch(pricesSorted, low)
  let highIndex = high >= 20000 
  ? size - 1 
  : binarySearch(pricesSorted, high) - 1

  console.log(`Range: $${low}-$${high}`)
  console.log(`lowIndex: ${lowIndex}, highIndex: ${highIndex}`)
  console.log(`low card: ${productSorted[lowIndex]} $${pricesSorted[lowIndex]}`)
  console.log(`high card: ${productSorted[highIndex]} $${pricesSorted[highIndex]}`)
  console.log(`total cards in range: ${highIndex - lowIndex + 1}`)

  if (lowIndex > highIndex || highIndex < 0) {
    console.warn(`No cards found in range $${low}-$${high}`)
    return null
  }

  const rangeSize = highIndex - lowIndex + 1

  let attempts = 0
  let baseIndex = Math.floor(Math.random() * (highIndex - lowIndex + 1)) + lowIndex

  while(seenSet.has(baseIndex)){
    attempts += 1
    if (attempts > rangeSize) {
      // Seen everything in range, reset and start fresh
      seenSet.clear()
      break
    }
    baseIndex = Math.floor(Math.random() * (highIndex - lowIndex + 1)) + lowIndex
  }

  console.log("ELEMENTS IN SET:")
  seenSet.forEach((element) => console.log(element));

  seenSet.add(baseIndex)
  

  console.log(`picked baseIndex: ${baseIndex} — ${productSorted[baseIndex]} $${pricesSorted[baseIndex]}`)
  const baseProduct = productSorted[baseIndex]
  const basePrice = pricesSorted[baseIndex]
  const baseImage = imagesSorted[baseIndex]
  const correctPrice = Math.round(percent / 100 * basePrice * 100) / 100
  
  return { baseProduct, basePrice, baseImage, correctPrice, percent }
}
  
// Score an estimate answer
export function scoreEstimate(guess, correctPrice) {
  const error = Math.abs(correctPrice - guess) / correctPrice
  const threshold = 0.025
  
  if (error <= threshold) return 100
  return Math.max(0, Math.round((1 - error) * 100))
}