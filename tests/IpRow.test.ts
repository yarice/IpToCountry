import { render, fireEvent, screen } from '@testing-library/vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import IpRow from '../src/components/IpRow.vue'
import * as ipService from '../src/services/ipService'

vi.mock('../src/services/ipService', () => ({
  lookupIp: vi.fn(),
}))

describe('IpRow.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders row number', () => {
    render(IpRow, { props: { index: 1, disabled: false } })
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls API when valid IP is entered', async () => {
    ;(ipService.lookupIp as any).mockResolvedValue({
      country: 'United States',
      flag: 'https://flagcdn.com/us.svg',
      timezone: 'America/Chicago',
    })

    render(IpRow, { props: { index: 1, disabled: false } })
    const input = screen.getByRole('textbox')

    await fireEvent.update(input, '8.8.8.8')
    await fireEvent.blur(input)

    // Wait for debounce delay
    await new Promise((resolve) => setTimeout(resolve, 250))

    expect(ipService.lookupIp).toHaveBeenCalledWith('8.8.8.8')
    expect(await screen.findByAltText('flag')).toBeInTheDocument()
  })

  it('shows error for invalid IP', async () => {
    render(IpRow, { props: { index: 1, disabled: false } })
    const input = screen.getByRole('textbox')

    await fireEvent.update(input, 'invalid-ip')
    await fireEvent.blur(input)

    expect(await screen.findByText(/valid IPv4 or IPv6/)).toBeInTheDocument()
    expect((ipService.lookupIp as any).mock.calls.length).toBe(0)
  })

  it('shows error when API fails', async () => {
    ;(ipService.lookupIp as any).mockRejectedValue(new Error('API Error'))

    render(IpRow, { props: { index: 1, disabled: false } })
    const input = screen.getByRole('textbox')
    await fireEvent.update(input, '8.8.8.8')
    await fireEvent.blur(input)

    expect(await screen.findByText(/API Error/)).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(IpRow, { props: { index: 1, disabled: true } })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('emits events correctly', async () => {
    const { emitted } = render(IpRow, { props: { index: 1, disabled: false } })
    const input = screen.getByRole('textbox')

    await fireEvent.focus(input)
    expect(emitted()['edit']).toBeTruthy()
  })
})
