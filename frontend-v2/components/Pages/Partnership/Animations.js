import GSAP from 'gsap'
import styles from '@/assets/styles/partnership.module.scss'

export default class Animations {
  constructor (element, camera) {
    this.element = element

    this.elements = {
      number: element.querySelector(`.${styles['section__title-number']}`),
      title: element.querySelector(`.${styles['section__title-text']}`),
      arrows: element.querySelectorAll(`.${styles['section__title-arrow']} svg`),
      paragraph: element.querySelector(`.${styles.section__paragraph}`),
      button: element.querySelector(`.${styles.section__button}`)
    }

    this.camera = camera

    this.animateIn()
  }

  animateIn () {
    const animateIn = GSAP.timeline({
      defaults: {
        ease: 'expo'
      }
    })

    animateIn
      .from(this.camera.position, {
        z: 4,
        duration: 3
      })

      .from([
        this.elements.number,
        this.elements.title,
        this.elements.text,
        this.elements.paragraph,
        this.elements.button,
        this.elements.arrows
      ], {
        y: -100,
        autoAlpha: 0,
        stagger: 0.2,
        duration: 1.6
      }, '<.3')
  }
}
