// src/tests/UpperLower.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import UpperLower from '../pages/UpperLower'

// Mock useCardData so tests don't hit Supabase
vi.mock('../hooks/useCardData', () => ({
  useCardData: () => ({
    productSorted: ['Charizard from Base Set', 'Pikachu from XY', 'Mewtwo from Base Set', 'Umbreon VMAX'],
    pricesSorted: [50, 100, 150, 200],
    imagesSorted: ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg'],
    loading: false
  })
}))

const renderUpperLower = () => render(
  <MemoryRouter>
    <UpperLower />
  </MemoryRouter>
)

describe('UpperLower', () => {
  it('shows difficulty selection on load', () => {
    renderUpperLower()
    expect(screen.getByText('Easy')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
    expect(screen.getByText('Hard')).toBeInTheDocument()
  })

  it('starts game when difficulty is selected', () => {
    renderUpperLower()
    fireEvent.click(screen.getByText('Easy'))
    expect(screen.getByText(/Which is more expensive/i)).toBeInTheDocument()
  })

  it('shows result after answering', () => {
    renderUpperLower()
    fireEvent.click(screen.getByText('Easy'))
    
    // Click option 1
    const buttons = screen.getAllByRole('button')
    const option1 = buttons.find(b => b.textContent.includes('1.'))
    fireEvent.click(option1)

    // Should show correct or wrong
    expect(
      screen.getByText(/Correct|Wrong/i)
    ).toBeInTheDocument()
  })

  it('tracks score correctly', () => {
    renderUpperLower()
    fireEvent.click(screen.getByText('Easy'))
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument()
  })
})