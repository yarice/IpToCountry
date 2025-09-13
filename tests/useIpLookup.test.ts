import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useIpLookup } from '../src/composables/useIpLookup'
import * as ipService from '../src/services/ipService'

vi.mock('../src/services/ipService', () => ({
  lookupIp: vi.fn(),
}))

describe('useIpLookup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const { state } = useIpLookup()
    const { loading, error, result } = state.value

    expect(loading).toBe(false)
    expect(error).toBe('')
    expect(result).toBe(null)
  })

  it('should handle successful IP Lookup', async () => {
    const mockResult = {
      country: 'United States',
      flag: 'https://flagcdn.com/us.svg',
      timezone: 'America/New_York',
    }

    ;(ipService.lookupIp as any).mockResolvedValue({
      success: true,
      data: mockResult,
    })

    const { state, searchIp } = useIpLookup()

    const result = await searchIp('8.8.8.8')
    const { loading, error, result: stateResult } = state.value

    expect(result).toBe(true)
    expect(loading).toBe(false)
    expect(error).toBe('')
    expect(stateResult).toEqual(mockResult)
  })

  it('should handle failed IP Lookup', async () => {
    ;(ipService.lookupIp as any).mockResolvedValue({
      success: false,
      error: 'API Error',
    })

    const { state, searchIp } = useIpLookup()

    const result = await searchIp('8.8.8.8')
    const { loading, error, result: stateResult } = state.value

    expect(result).toBe(false)
    expect(loading).toBe(false)
    expect(error).toBe('API Error')
    expect(stateResult).toBe(null)
  })

  it('should validate IP format before API call', async () => {
    const { state, searchIp } = useIpLookup()

    const result = await searchIp('invalid-ip')
    const { error } = state.value

    expect(result).toBe(false)
    expect(error).toBe('Please enter a valid IPv4 or IPv6 address')
    expect(ipService.lookupIp).not.toHaveBeenCalled()
  })

  it('should clear result correctly', () => {
    const { state, clearResult } = useIpLookup()

    state.value.result = { country: 'US', flag: 'flag.svg', timezone: 'UTC' }
    state.value.error = 'Some error'
    state.value.loading = true

    clearResult()
    const { result, error, loading } = state.value

    expect(result).toBe(null)
    expect(error).toBe('')
    expect(loading).toBe(false)
  })

  it('should set loading state during API call', async () => {
    ;(ipService.lookupIp as any).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                success: true,
                data: { country: 'US', flag: 'flag.svg', timezone: 'UTC' },
              }),
            100
          )
        )
    )

    const { state, searchIp } = useIpLookup()

    const searchPromise = searchIp('8.8.8.8')
    expect(state.value.loading).toBe(true)

    await searchPromise
    expect(state.value.loading).toBe(false)
  })
})
