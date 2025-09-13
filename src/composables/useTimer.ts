import { ref } from 'vue'

export function useTimer() {
  const time = ref('')
  let timer: number | null = null

  const startClock = (timezone: string) => {
    if (timer) clearInterval(timer)
    
    const update = () => {
      const now = new Date().toLocaleTimeString('en-GB', {
        timeZone: timezone,
      })
      time.value = now
    }
    
    update()
    timer = window.setInterval(update, 1000)
  }

  const stopClock = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    time.value = ''
  }

  return {
    time,
    startClock,
    stopClock
  }
}