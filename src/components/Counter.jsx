import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Button pressed: {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Press me
      </button>
    </div>
  )
}

export default Counter