import { render, fireEvent, screen } from '@testing-library/vue'
import { describe, it, expect } from 'vitest'
import App from '../src/App.vue'

describe('App.vue', () => {
  it('renders the app', () => {
    render(App)
    expect(screen.getByText(/IP Lookup/i)).toBeInTheDocument()
  })

  it('adds rows when clicking Add button', async () => {
    render(App)
    const addBtn = screen.getByRole('button', { name: /\+ Add/i })
    
    await fireEvent.click(addBtn)
    expect(screen.getAllByRole('textbox').length).toBe(1)
    
    await fireEvent.click(addBtn)
    expect(screen.getAllByRole('textbox').length).toBe(2)
  })

  it('can close and reopen the app', async () => {
    render(App)
    
    // Close the app
    const closeBtn = screen.getByRole('button', { name: /×/i })
    await fireEvent.click(closeBtn)
    expect(screen.getByRole('button', { name: /Open IP Lookup/i })).toBeInTheDocument()
    
    // Reopen the app
    const reopenBtn = screen.getByRole('button', { name: /Open IP Lookup/i })
    await fireEvent.click(reopenBtn)
    expect(screen.getByText(/IP Lookup/i)).toBeInTheDocument()
  })

  it('disables Add button when row is active', async () => {
    render(App)
    const addBtn = screen.getByRole('button', { name: /\+ Add/i })
    
    await fireEvent.click(addBtn)
    expect(addBtn).toBeDisabled()
  })
})
