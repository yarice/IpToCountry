import { vi, describe, it, expect } from 'vitest'
import { lookupIp } from '../src/services/ipService'

describe('ipService', () => {
  it('returns success response for valid IP', async () => {
    const mockData = {
      success: true,
      country: 'United States',
      country_code: 'US',
      timezone: { id: 'America/New_York' },
    }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    } as Response)

    const result = await lookupIp('8.8.8.8')

    expect(result.success).toBe(true)
    expect(result.data?.country).toBe('United States')
    expect(result.data?.flag).toBe('https://flagcdn.com/us.svg')
    expect(result.data?.timezone).toBe('America/New_York')
  })

  it('returns error response for invalid IP', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ success: false, message: 'Invalid IP' }),
    } as Response)

    const result = await lookupIp('invalid-ip')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Invalid IP')
    expect(result.data).toBeUndefined()
  })

  it('returns error response on HTTP error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response)

    const result = await lookupIp('8.8.8.8')

    expect(result.success).toBe(false)
    expect(result.error).toBe('HTTP 404: Not Found')
  })

  it('returns error response on network failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const result = await lookupIp('8.8.8.8')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Network error')
  })

  it('handles malformed API response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ invalid: 'response' }),
    } as Response)

    const result = await lookupIp('8.8.8.8')

    expect(result.success).toBe(false)
    expect(result.error).toBe('Lookup failed')
  })
})
