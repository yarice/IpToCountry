import { describe, it, expect } from 'vitest'
import { useAppState } from '../src/composables/useAppState'

describe('useAppState', () => {
  it('should initialize with correct default state', () => {
    const { state } = useAppState()
    const { visible, rows, activeRowId } = state.value
    
    expect(visible).toBe(true)
    expect(rows).toEqual([])
    expect(activeRowId).toBe(null)
  })

  it('should add rows and make them active by default', () => {
    const { state, addRow } = useAppState()
    
    addRow()
    const { rows, activeRowId } = state.value
    
    expect(rows).toHaveLength(1)
    expect(rows[0]).toHaveProperty('id')
    expect(activeRowId).toBe(rows[0].id)
  })

  it('should manage active row state correctly', () => {
    const { state, addRow, setActiveRow, clearActiveRow } = useAppState()
    
    addRow()
    const { rows } = state.value
    const rowId = rows[0].id
    
    clearActiveRow()
    expect(state.value.activeRowId).toBe(null)
    
    setActiveRow(rowId)
    expect(state.value.activeRowId).toBe(rowId)
  })

  it('should check if row is active correctly', () => {
    const { state, addRow, isRowActive } = useAppState()
    
    addRow()
    const { rows } = state.value
    const rowId = rows[0].id
    
    expect(isRowActive(rowId)).toBe(true)
    expect(isRowActive('non-existent-id')).toBe(false)
  })

  it('should close app and clear all state', () => {
    const { state, addRow, closeApp } = useAppState()
    
    addRow()
    closeApp()
    const { visible, rows, activeRowId } = state.value
    
    expect(visible).toBe(false)
    expect(rows).toEqual([])
    expect(activeRowId).toBe(null)
  })

  it('should reopen app', () => {
    const { state, closeApp, reopenApp } = useAppState()
    
    closeApp()
    reopenApp()
    
    expect(state.value.visible).toBe(true)
  })
})
