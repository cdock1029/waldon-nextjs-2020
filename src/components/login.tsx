import { useState } from 'react'
import { signInWithPopup } from 'data/firebase'
function Login(props) {
  const [loading, setLoading] = useState(false)
  function handleClick() {
    setLoading(true)
    signInWithPopup()
  }
  return (
    <button {...props} disabled={loading} onClick={handleClick}>
      Login
    </button>
  )
}

export default Login
