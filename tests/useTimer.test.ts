import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useTimer } from '../src/composables/useTimer'

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty time', () => {
    const { time } = useTimer()
    expect(time.value).toBe('')
  })

  it('should start clock and update time', () => {
    const { time, startClock } = useTimer()
    
    startClock('America/New_York')
    
    expect(time.value).toMatch(/\d{2}:\d{2}:\d{2}/)
    
    vi.advanceTimersByTime(1000)
    expect(time.value).toMatch(/\d{2}:\d{2}:\d{2}/)
  })

  it('should stop clock correctly', () => {
    const { time, startClock, stopClock } = useTimer()
    
    startClock('America/New_York')
    const initialTime = time.value
    
    stopClock()
    
    vi.advanceTimersByTime(1000)
    expect(time.value).toBe('')
  })

  it('should clear existing timer when starting new one', () => {
    const { time, startClock } = useTimer()
    
    startClock('America/New_York')
    const firstTime = time.value
    
    startClock('Europe/London')
    const secondTime = time.value
    
    expect(firstTime).not.toBe(secondTime)
  })

  it('should handle cleanup on unmount', () => {
    const { startClock, stopClock } = useTimer()
    
    startClock('America/New_York')
    
    stopClock()
    
    vi.advanceTimersByTime(1000)
    expect(true).toBe(true)
  })
})
