import { signInWithPopup } from 'data/firebase'
function Login(props) {
  return (
    <button {...props} onClick={signInWithPopup}>
      Login
    </button>
  )
}

export default Login
