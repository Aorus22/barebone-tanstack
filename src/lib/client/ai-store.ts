import { useState, useEffect } from "react"
import type { Editor } from "@tiptap/react"

type AiState = {
  isOpen: boolean
  activeEditor: Editor | null
}

let state: AiState = {
  isOpen: false,
  activeEditor: null,
}

const listeners = new Set<(state: AiState) => void>()

export const aiStore = {
  getState() {
    return state
  },
  setIsOpen(isOpen: boolean) {
    state = { ...state, isOpen }
    listeners.forEach((listener) => listener(state))
  },
  setActiveEditor(activeEditor: Editor | null) {
    state = { ...state, activeEditor }
    listeners.forEach((listener) => listener(state))
  },
  subscribe(listener: (state: AiState) => void) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
}

export function useAiStore() {
  const [val, setVal] = useState(state)
  useEffect(() => {
    return aiStore.subscribe(setVal)
  }, [])
  return val
}
