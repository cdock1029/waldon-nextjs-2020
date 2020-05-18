import styles from 'styles/loading.module.css'
import { useEffect, useRef } from 'react'

export function Loading() {
  const ref = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)
  useEffect(() => {
    mounted.current = true
    const id = setTimeout(() => {
      if (mounted.current) {
        ref.current?.removeAttribute('hidden')
      }
    }, 500)
    return () => {
      clearTimeout(id)
      mounted.current = false
    }
  }, [])
  return (
    <div className={styles.spinner} key="loading-spinner" hidden ref={ref}>
      <div className={styles.ldsRipple}>
        <div></div>
        <div></div>
      </div>
    </div>
  )
}
