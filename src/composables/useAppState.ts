import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export interface Row {
  id: string
}

export interface AppState {
  visible: boolean
  rows: Row[]
  activeRowId: string | null
}

export function useAppState() {
  const state = ref<AppState>({
    visible: true,
    rows: [],
    activeRowId: null
  })

  const addRow = () => {
    const newRow = { id: uuidv4() }
    const { rows } = state.value
    rows.push(newRow)
    setActiveRow(newRow.id)
  }


  const setActiveRow = (id: string) => {
    state.value.activeRowId = id
  }

  const clearActiveRow = () => {
    state.value.activeRowId = null
  }

  const isRowActive = (id: string) => {
    const { activeRowId } = state.value
    return activeRowId === id
  }

  const closeApp = () => {
    const { rows } = state.value
    rows.length = 0
    clearActiveRow()
    state.value.visible = false
  }

  const reopenApp = () => {
    state.value.visible = true
  }

  return {
    state,
    addRow,
    setActiveRow,
    clearActiveRow,
    isRowActive,
    closeApp,
    reopenApp
  }
}