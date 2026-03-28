import { useState, useEffect } from 'react'

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 500,
    isPresent: false
  })

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY, isPresent: true })
    }

    const handleMouseLeave = () => {
      setMousePosition(prev => ({ ...prev, isPresent: false }))
    }

    const handleMouseEnter = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY, isPresent: true })
    }

    window.addEventListener('mousemove', updateMousePosition)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Attempt to detect if mouse is already in window on mount
    if (document.hasFocus()) {
      // Just waiting for the first mousemove to set isPresent to true accurately
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [])

  return mousePosition
}
