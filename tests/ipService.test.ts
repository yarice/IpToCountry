import { vi, describe, it, expect } from 'vitest'
import { lookupIp } from '../src/services/ipService'

describe('ipService', () => {
  it('returns country info for valid IP', async () => {
    const mockData = {
      success: true,
      country: 'United States',
      country_code: 'US',
      timezone: { id: 'America/New_York' }
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData
    } as Response)

    const result = await lookupIp('8.8.8.8')
    
    expect(result.country).toBe('United States')
    expect(result.flag).toBe('https://flagcdn.com/us.svg')
    expect(result.timezone).toBe('America/New_York')
  })

  it('throws error for invalid IP', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: false })
    } as Response)

    await expect(lookupIp('invalid-ip')).rejects.toThrow('Lookup failed')
  })

  it('throws error on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    await expect(lookupIp('8.8.8.8')).rejects.toThrow('Network error')
  })
})