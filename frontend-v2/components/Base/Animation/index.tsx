import { useEffect } from 'react'
import styles from '@/assets/styles/animation.module.scss'

export const ContentLoading = ({ className }: { className?: string }) => {
  useEffect(() => {
    const animate = () => {
      const element = document.getElementById('loading-content')
      if (!element) return
      element.classList.add('dots--animate')
      setTimeout(() => {
        element.classList.remove('dots--animate')
        setTimeout(() => {
          animate()
        }, 300)
      }, 1500)
    }

    animate()
  }, [])
  return <div className={`${className} text-2xl font-bold`}>
    Loading
    <div id="loading-content" className="dots">
      <span className="dot z"></span>
      <span className="dot f"></span>
      <span className="dot s"></span>
      <span className="dot t"><span className="dot l"></span></span>
    </div>
  </div>
}

export const Spinning = ({ className }: { className?:string }) => {
  return <div className={`${styles.spinning} ${className}`}></div>
}
