import { signInWithPopup } from 'data/firebase'
function Login() {
  return (
    <div>
      <button onClick={signInWithPopup}>Login</button>
    </div>
  )
}

export default Login
