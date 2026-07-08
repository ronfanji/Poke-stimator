// src/hooks/useCardData.js
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export function useCardData() {
  const [productSorted, setProductSorted] = useState([])
  const [pricesSorted, setPricesSorted] = useState([])
  const [imagesSorted, setImagesSorted] = useState([])
  const [loading, setLoading] = useState(true)

  // this fetches ALL data, maybe make one that fetches certain eras only or fetches certain price ranges
  useEffect(() => {
    async function fetchCards() {

      let allData = []
      let from = 0
      const batchSize = 1000

      // Keep fetching until we get all rows
      while (true) {
        const { data, error } = await supabase
          .from('card_prices')
          .select('*')
          .order('price', { ascending: true })
          .range(from, from + batchSize - 1)

        if (error) {
          console.error(error)
          break
        }

        allData = [...allData, ...data]

        if (data.length < batchSize) break  // no more rows left
        from += batchSize
      }
      console.log(`Total cards fetched: ${allData.length}`)


      const sorted = [...allData].sort((a, b) => a.price - b.price)

      setProductSorted(sorted.map(card =>
        card.era === 'Sealed'
          ? card.name
          : `${card.name} from ${card.set}`
      ))
      setPricesSorted(sorted.map(card => card.price))
      setImagesSorted(sorted.map(card => card.image))
      setLoading(false)
    }

    fetchCards()
  }, [])

  return { productSorted, pricesSorted, imagesSorted, size: productSorted.length, loading }
}

export function useCardDataByEra(era_num) {
  const [productSorted, setProductSorted] = useState([])
  const [pricesSorted, setPricesSorted] = useState([])
  const [imagesSorted, setImagesSorted] = useState([])
  const [loading, setLoading] = useState(true)

  // this fetches ALL data, maybe make one that fetches certain eras only or fetches certain price ranges
  useEffect(() => {
    async function fetchCards() {

      let allData = []
      let from = 0
      const batchSize = 1000

      // Keep fetching until we get all rows
      while (true) {
        const { data, error } = await supabase
          .from('card_prices')
          .select('*')
          .eq('era_num', era_num) // filtered by era
          .order('price', { ascending: true })
          .range(from, from + batchSize - 1)

        if (error) {
          console.error(error)
          break
        }

        allData = [...allData, ...data]

        if (data.length < batchSize) break  // no more rows left
        from += batchSize
      }
      console.log(`Total cards fetched: ${allData.length}`)


      const sorted = [...allData].sort((a, b) => a.price - b.price)

      setProductSorted(sorted.map(card =>
        card.era === 'Sealed'
          ? card.name
          : `${card.name} from ${card.set}`
      ))
      setPricesSorted(sorted.map(card => card.price))
      setImagesSorted(sorted.map(card => card.image))
      setLoading(false)
    }

    fetchCards()
  }, [era_num]) //re-fetch when era_num changes

  return { productSorted, pricesSorted, imagesSorted, size: productSorted.length, loading }
}

export function useCardDataByPriceRange(startPrice, endPrice) {
  const [productSorted, setProductSorted] = useState([])
  const [pricesSorted, setPricesSorted] = useState([])
  const [imagesSorted, setImagesSorted] = useState([])
  const [loading, setLoading] = useState(true)

  // this fetches ALL data, maybe make one that fetches certain eras only or fetches certain price ranges
  useEffect(() => {
    async function fetchCards() {

      let allData = []
      let from = 0
      const batchSize = 1000

      // Keep fetching until we get all rows
      while (true) {
        const { data, error } = await supabase
          .from('card_prices')
          .select('*')
          .gte('price', startPrice)
          .lte('price', endPrice)
          .order('price', { ascending: true })
          .range(from, from + batchSize - 1)

        if (error) {
          console.error(error)
          break
        }

        allData = [...allData, ...data]

        if (data.length < batchSize) break  // no more rows left
        from += batchSize
      }
      console.log(`Total cards fetched: ${allData.length}`)


      const sorted = [...allData].sort((a, b) => a.price - b.price)

      setProductSorted(sorted.map(card =>
        card.era === 'Sealed'
          ? card.name
          : `${card.name} from ${card.set}`
      ))
      setPricesSorted(sorted.map(card => card.price))
      setImagesSorted(sorted.map(card => card.image))
      setLoading(false)
    }

    fetchCards()
  }, [startPrice, endPrice]) //re-fetch when these parameters change

  return { productSorted, pricesSorted, imagesSorted, size: productSorted.length, loading }
}


export function useCardDataCardle() {
  const [allCards, setAllCards] = useState([])

  useEffect(() => {
    async function fetchCards() {
      const { data, error } = await supabase
        .from('card_prices')
        .select('*')
        .neq('era_num', 100)
      
      if (error) {
        console.error(error)
      }
      
      if(data){
        setAllCards(data)
      }
    }
    
    fetchCards()
  }, [])
  return {allCards}
}