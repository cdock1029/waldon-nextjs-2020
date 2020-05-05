import { useEffect, useRef } from 'react'
import styles from 'styles/loading.module.css'

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
    <div className="loading-spinner" key="loading-spinner" hidden ref={ref}>
      <div className={styles.ldsRipple}>
        <div></div>
        <div></div>
      </div>
      <style jsx>{`
        & {
          position: fixed;
          top: 0rem;
          left: 50%;
        }
      `}</style>
    </div>
  )
}
