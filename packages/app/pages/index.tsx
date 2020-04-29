import { useState } from 'react'

export default function Index() {
  const [val, setVal] = useState(1)
  return (
    <div className="hero">
      <h1 className="title">Next JS & Tailwind CSS</h1>
      <p>Val: {val}</p>
      <button onClick={() => setVal((val) => val + 1)}>Inc</button>
    </div>
  )
}
