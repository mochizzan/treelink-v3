import { useCallback, useEffect, useRef, useState } from 'react'

/** Holds a value and resets it to its initial value after a short delay. */
export function useTemporaryState<T>(initial: T) {
  const [value, setValue] = useState<T>(initial)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setTemporary = useCallback(
    (next: T, duration = 2000) => {
      setValue(next)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setValue(initial), duration)
    },
    [initial],
  )

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  return [value, setTemporary] as const
}
