import { useState } from 'react'

// Won't trigger anymore once the effect result has evaluated truthy
const useSingleTimeEffect = (effect) => {
  const [executed, setExecuted] = useState(false)

  if (!executed) {
    effect()
    setExecuted(true)
  }
}

export default useSingleTimeEffect
