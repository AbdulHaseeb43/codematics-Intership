import { useState, useEffect } from "react"

let toastCallback = null

export function showToast(message) {
  if (toastCallback) toastCallback(message)
}

export default function Toast() {
  const [message, setMessage] = useState(null)

  useEffect(() => {
    toastCallback = setMessage
    return () => { toastCallback = null }
  }, [])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2500)
      return () => clearTimeout(timer)
    }
  }, [message])

  if (!message) return null

  return <div className="toast">{message}</div>
}
