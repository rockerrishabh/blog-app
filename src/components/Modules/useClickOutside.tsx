import { useEffect } from 'react'

export default function useClickOutside(
  ref: { current: any },
  handler: (arg0: { target: any }) => void
) {
  useEffect(() => {
    const listner = (event: { target: any }) => {
      const el = ref?.current
      if (!el || el.contains(event.target)) {
        return
      }

      handler(event)
    }

    document.addEventListener('mousedown', listner)
    document.addEventListener('touchstart', listner)

    return () => {
      document.removeEventListener('mousedown', listner)
      document.removeEventListener('touchstart', listner)
    }
  }, [ref, handler])
}
