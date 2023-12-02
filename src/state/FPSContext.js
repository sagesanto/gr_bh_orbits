import React, { createContext, useContext, useState, useRef, useCallback } from 'react'

export const FPSContext = createContext()

export function FPSProvider({ children }) {
  const [fps, setFps] = useState(0)
  const lastTickTime = useRef(performance.now())
  const frameCount = useRef(0)

  const tick = useCallback(() => {
    const now = performance.now()
    const delta = now - lastTickTime.current
    frameCount.current++

    if (delta > 1000) {
      setFps(frameCount.current)
      frameCount.current = 0
      lastTickTime.current = now
    }
  }, [])

  return (
    <FPSContext.Provider value={{ fps, tick }}>
      {children}
    </FPSContext.Provider>
  )
}

export function useFPS() {
  return useContext(FPSContext)
}