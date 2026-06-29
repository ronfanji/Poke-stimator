// src/tests/gameLogic.test.js
import { describe, it, expect } from 'vitest'
import { generateUpperLower, generateEstimate, scoreEstimate, DIFFICULTIES, ESTIMATE_RANGES } from '../utils/gameLogic'

// Mock data
const mockProducts = ["Inteleon VMAX (Alternate Art Secret)", "Zeraora VSTAR", "Mega Dragonite EX", "Milotic EX", "Moltres & Zapdos & Articuno GX", "Giratina VSTAR"]
const mockPrices = [29, 27, 54, 143, 168, 420]
const mockImages = ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg']

describe('scoreEstimate', () => {
  it('returns 100 when guess is within 2.5% of correct price', () => {
    expect(scoreEstimate(100, 100)).toBe(100)
    expect(scoreEstimate(102, 100)).toBe(100)  // within 2.5%
  })

  it('returns lower score the further off the guess is', () => {
    const closeScore = scoreEstimate(95, 100)
    const farScore = scoreEstimate(50, 100)
    expect(closeScore).toBeGreaterThan(farScore)
  })

  it('never returns negative score', () => {
    expect(scoreEstimate(0, 100)).toBeGreaterThanOrEqual(0)
  })

  it('returns the same score for two guesses of the same value', () =>{
    const firstScore = scoreEstimate(67, 100)
    const secondScore = scoreEstimate(67, 100)
    expect(firstScore).equals(secondScore)
  })
})

describe('generateUpperLower', () => {
  it('returns a valid problem object', () => {
    const problem = generateUpperLower(mockProducts, mockPrices, mockImages, 'E')
    expect(problem).not.toBeNull()
    expect(problem).toHaveProperty('baseProduct')
    expect(problem).toHaveProperty('basePrice')
    expect(problem).toHaveProperty('secondProduct')
    expect(problem).toHaveProperty('secondPrice')
    expect(problem).toHaveProperty('baseImage')
    expect(problem).toHaveProperty('secondImage')
  })

  it('base and second prices are different', () => {
    const problem = generateUpperLower(mockProducts, mockPrices, mockImages, 'E')
    expect(problem.basePrice).not.toBe(problem.secondPrice)
  })

  it('returns null when given empty arrays', () => {
    const problem = generateUpperLower([], [], [], 'E')
    expect(problem).toBeNull()
  })
})

describe('generateEstimate', () => {
  const seenSet = new Set()

  it('returns a card within the correct price range', () => {
    const problem = generateEstimate(mockProducts, mockPrices, mockImages, 'L', seenSet)
    expect(problem).not.toBeNull()
    expect(problem.basePrice).toBeGreaterThanOrEqual(10)
    expect(problem.basePrice).toBeLessThanOrEqual(100)
  })

  it('returns correct percent for each range', () => {
    const problem = generateEstimate(mockProducts, mockPrices, mockImages, 'L', seenSet)
    expect(problem.percent).toBe(ESTIMATE_RANGES['L'].percent)
  })

  it('does not repeat the same card twice', () => {
    const seenSet = new Set()
    const p1 = generateEstimate(mockProducts, mockPrices, mockImages, 'L', seenSet)
    const p2 = generateEstimate(mockProducts, mockPrices, mockImages, 'L', seenSet)
    if (p1 && p2) {
      expect(p1.baseProduct).not.toBe(p2.baseProduct)
    }
  })
})