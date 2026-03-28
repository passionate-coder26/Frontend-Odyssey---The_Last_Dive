import React, { createContext, useContext, useState, useEffect } from 'react'

const ClueContext = createContext()

export const useClue = () => {
  const context = useContext(ClueContext)
  if (!context) {
    throw new Error('useClue must be used within a ClueProvider')
  }
  return context
}

export const ClueProvider = ({ children }) => {
  const [collectedClues, setCollectedClues] = useState({ tank: false, hull: false, helmet: false })

  const collectClue = (clueId) => {
    if (!collectedClues[clueId]) {
      setCollectedClues(prev => ({ ...prev, [clueId]: true }))
      return true // Successfully collected
    }
    return false // Already collected
  }

  const resetClues = () => {
    setCollectedClues({ tank: false, hull: false, helmet: false })
  }

  return (
    <ClueContext.Provider value={{ collectedClues, collectClue, resetClues }}>
      {children}
    </ClueContext.Provider>
  )
}
