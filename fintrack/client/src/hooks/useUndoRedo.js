import { useState, useCallback } from "react"

export function useUndoRedo(initialState) {
  const [history, setHistory] = useState([initialState])
  const [index, setIndex] = useState(0)

  const current = history[index]

  const push = useCallback((newState) => {
    const trimmed = history.slice(0, index + 1)
    setHistory([...trimmed, newState])
    setIndex(trimmed.length)
  }, [history, index])

  const undo = useCallback(() => {
    if (index > 0) setIndex(i => i - 1)
  }, [index])

  const redo = useCallback(() => {
    if (index < history.length - 1) setIndex(i => i + 1)
  }, [index, history.length])

  return {
    current,
    push,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1
  }
}
