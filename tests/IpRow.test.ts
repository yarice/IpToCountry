import { render, fireEvent, screen } from '@testing-library/vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import IpRow from '../src/components/IpRow.vue'
import * as ipService from '../src/services/ipService'

vi.mock('../src/services/ipService', () => ({
  lookupIp: vi.fn(),
}))

// Mock the composables
const mockState = ref({
  loading: false,
  result: null as any,
  error: null as any,
})

const mockTime = ref('')
const mockSearchIp = vi.fn()
const mockStartClock = vi.fn()
const mockStopClock = vi.fn()

vi.mock('../src/composables/useIpLookup', () => ({
  useIpLookup: vi.fn(() => ({
    state: mockState,
    searchIp: mockSearchIp,
    clearResult: vi.fn(),
  })),
}))

vi.mock('../src/composables/useTimer', () => ({
  useTimer: vi.fn(() => ({
    time: mockTime,
    startClock: mockStartClock,
    stopClock: mockStopClock,
  })),
}))

describe('IpRow.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock state
    mockState.value.loading = false
    mockState.value.result = null
    mockState.value.error = null
    mockTime.value = ''
  })

  it('renders row number and input field', () => {
    render(IpRow, { props: { index: 1, disabled: false, rowId: 'test-id' } })
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('can be disabled', () => {
    render(IpRow, { props: { index: 1, disabled: true, rowId: 'test-id' } })
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('emits edit event on focus', async () => {
    const { emitted } = render(IpRow, {
      props: { index: 1, disabled: false, rowId: 'test-id' },
    })
    const input = screen.getByRole('textbox')

    await fireEvent.focus(input)
    expect(emitted()['edit']).toBeTruthy()
    expect(emitted()['edit'][0]).toEqual(['test-id'])
  })

  it('calls API and shows result for valid IP', async () => {
    mockSearchIp.mockResolvedValue(true)
    mockState.value.result = {
      country: 'United States',
      flag: 'https://flagcdn.com/us.svg',
      timezone: 'America/Chicago',
    }
    mockTime.value = '12:34:56'

    const { emitted } = render(IpRow, {
      props: { index: 1, disabled: false, rowId: 'test-id' },
    })
    const input = screen.getByRole('textbox')

    await fireEvent.update(input, '8.8.8.8')
    await fireEvent.blur(input)

    expect(mockSearchIp).toHaveBeenCalledWith('8.8.8.8')
    expect(mockStartClock).toHaveBeenCalledWith('America/Chicago')
    expect(emitted()['done']).toBeTruthy()
  })

  it('shows error for invalid IP without calling API', async () => {
    mockSearchIp.mockResolvedValue(false)
    mockState.value.error = 'Invalid IP address'

    const { emitted } = render(IpRow, {
      props: { index: 1, disabled: false, rowId: 'test-id' },
    })
    const input = screen.getByRole('textbox')

    await fireEvent.update(input, 'invalid-ip')
    await fireEvent.blur(input)

    expect(mockSearchIp).toHaveBeenCalledWith('invalid-ip')
    expect(mockStopClock).toHaveBeenCalled()
    expect(emitted()['done']).toBeFalsy()
  })

  it('handles API failure gracefully', async () => {
    mockSearchIp.mockResolvedValue(false)
    mockState.value.error = 'API Error'

    const { emitted } = render(IpRow, {
      props: { index: 1, disabled: false, rowId: 'test-id' },
    })
    const input = screen.getByRole('textbox')

    await fireEvent.update(input, '8.8.8.8')
    await fireEvent.blur(input)

    expect(mockSearchIp).toHaveBeenCalledWith('8.8.8.8')
    expect(mockStopClock).toHaveBeenCalled()
    expect(emitted()['done']).toBeFalsy()
  })

  it('does not make API call if IP empty', async () => {
    const { emitted } = render(IpRow, {
      props: { index: 1, disabled: false, rowId: 'test-id' },
    })
    const input = screen.getByRole('textbox')

    await fireEvent.focus(input)
    await fireEvent.blur(input)

    expect(mockSearchIp).not.toHaveBeenCalled()
    expect(emitted()['done']).toBeFalsy()
  })

  it('shows loading state during API call', async () => {
    mockState.value.loading = true

    render(IpRow, { props: { index: 1, disabled: false, rowId: 'test-id' } })

    expect(
      screen.getByRole('textbox').parentElement?.querySelector('.spinner')
    ).toBeInTheDocument()
  })
})
