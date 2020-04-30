import { useEffect, useRef } from 'react'
import styles from 'styles/loading.module.css'

function Loading() {
  const ref = useRef(null)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    const id = setTimeout(() => {
      if (mounted.current) {
        ref.current.removeAttribute('hidden')
      }
    }, 500)
    return () => {
      clearTimeout(id)
      mounted.current = false
    }
  }, [])
  return (
    <div hidden ref={ref}>
      <div className={styles.ldsRipple}>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}

export default Loading
