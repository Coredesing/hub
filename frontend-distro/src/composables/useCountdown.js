import { ref, computed } from 'vue'
import { intervalToDuration, differenceInDays } from 'date-fns'

export default function (_deadline = new Date(), _nextDeadline) {
  const now = ref(new Date())
  const timer = ref(null)
  const sync = () => {
    now.value = new Date()
  }
  const start = () => {
    timer.value = setInterval(() => {
      sync()
    }, 1000)
  }
  const stop = () => {
    if (!timer.value) {
      return
    }

    clearInterval(timer.value)
  }
  const openNow = computed(() => now.value > _deadline)
  const interval = computed(() => {
    if (openNow.value) {
      const d = differenceInDays(_nextDeadline, now.value)

      const i = intervalToDuration({
        start: now.value,
        end: _nextDeadline
      })

      i.days = d
      return i
    }

    return intervalToDuration({
      start: now.value,
      end: _deadline
    })
  })

  return {
    now,
    interval,
    start,
    stop,
    openNow
  }
}
