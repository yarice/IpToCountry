import { render, fireEvent, screen } from '@testing-library/vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import App from '../src/App.vue'

let mockVisible = true
let mockRows = [] as any[]
let mockActiveRowId = null as string | null

const mockAddRow = vi.fn()
const mockSetActiveRow = vi.fn()
const mockClearActiveRow = vi.fn()
const mockIsRowActive = vi.fn()
const mockCloseApp = vi.fn()
const mockReopenApp = vi.fn()

vi.mock('../src/composables/useAppState', () => ({
  useAppState: vi.fn(() => ({
    state: {
      visible: mockVisible,
      rows: mockRows,
      activeRowId: mockActiveRowId,
    },
    addRow: mockAddRow,
    setActiveRow: mockSetActiveRow,
    clearActiveRow: mockClearActiveRow,
    isRowActive: mockIsRowActive,
    closeApp: mockCloseApp,
    reopenApp: mockReopenApp,
  })),
}))

vi.mock('../src/components/IpRow.vue', () => ({
  default: {
    name: 'IpRow',
    props: ['index', 'disabled', 'rowId'],
    emits: ['done', 'edit'],
    template: `
      <div class="ip-entry">
        <span class="ip-number">{{ index }}</span>
        <input 
          type="text" 
          class="form-control" 
          :disabled="disabled" 
          @focus="$emit('edit', rowId)"
        />
      </div>
    `,
  },
}))

describe('App.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockVisible = true
    mockRows.length = 0
    mockActiveRowId = null
  })

  it('renders the app with title and subtitle', () => {
    render(App)
    expect(screen.getByText(/IP To Country/i)).toBeInTheDocument()
    expect(
      screen.getByText(/Enter one or more IP addresses/)
    ).toBeInTheDocument()
  })

  it('adds rows when clicking Add button', async () => {
    render(App)
    const addBtn = screen.getByRole('button', { name: /\+ Add/i })

    mockRows.push({ id: 'row1' })
    await fireEvent.click(addBtn)
    expect(mockAddRow).toHaveBeenCalledTimes(1)

    mockRows.push({ id: 'row2' })
    await fireEvent.click(addBtn)
    expect(mockAddRow).toHaveBeenCalledTimes(2)
  })

  it('can close and reopen the app', async () => {
    render(App)

    const closeBtn = screen.getByRole('button', { name: /×/i })
    await fireEvent.click(closeBtn)
    expect(mockCloseApp).toHaveBeenCalled()

    mockVisible = false
    const { rerender: rerenderClosed } = render(App)
    expect(
      screen.getByRole('button', { name: /Open IP To Country/i })
    ).toBeInTheDocument()

    const reopenBtn = screen.getByRole('button', {
      name: /Open IP To Country/i,
    })
    await fireEvent.click(reopenBtn)
    expect(mockReopenApp).toHaveBeenCalled()
  })

  it('disables Add button when row is active', async () => {
    mockActiveRowId = 'active-row-id'
    render(App)
    const addBtn = screen.getByRole('button', { name: /\+ Add/i })
    expect(addBtn).toBeDisabled()
  })

  it('enables Add button when no row is active', async () => {
    mockActiveRowId = null
    render(App)
    const addBtn = screen.getByRole('button', { name: /\+ Add/i })
    expect(addBtn).not.toBeDisabled()
  })

  it('disables other rows when one is active', async () => {
    mockRows.push({ id: 'row1' }, { id: 'row2' })
    mockActiveRowId = 'row1'
    mockIsRowActive.mockImplementation((id: string) => id === 'row1')

    render(App)

    const inputs = screen.getAllByRole('textbox')
    expect(inputs[0]).not.toBeDisabled()
    expect(inputs[1]).toBeDisabled()
  })
})
