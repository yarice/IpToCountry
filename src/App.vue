<template>
  <div>
    <div v-if="state.visible" class="app">
      <div class="header">
        <h3>IP Lookup</h3>
        <button class="close-btn" @click="closeApp">&times;</button>
      </div>
      <p class="subtitle">
        Enter one or more IP addresses and get their country
      </p>

      <button class="btn-primary" @click="addRow" :disabled="state.activeRowId">
        + Add
      </button>

      <div class="rows">
        <div
          v-for="(row, index) in state.rows"
          :key="row.id"
          class="row-wrapper"
        >
          <IpRow
            :index="index + 1"
            :rowId="row.id"
            :disabled="state.activeRowId && !isRowActive(row.id)"
            @done="handleRowDone"
            @edit="handleRowEdit"
          />
        </div>
      </div>
    </div>

    <div v-else class="reopen">
      <button class="btn-primary" @click="reopenApp">Open IP Lookup</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import IpRow from './components/IpRow.vue'
import { useAppState } from './composables/useAppState'

export default defineComponent({
  components: { IpRow },
  setup() {
    const {
      state,
      addRow,
      setActiveRow,
      clearActiveRow,
      isRowActive,
      closeApp,
      reopenApp,
    } = useAppState()

    const handleRowDone = () => {
      clearActiveRow()
    }

    const handleRowEdit = (rowId: string) => {
      setActiveRow(rowId)
    }

    return {
      state,
      addRow,
      setActiveRow,
      clearActiveRow,
      isRowActive,
      closeApp,
      reopenApp,
      handleRowDone,
      handleRowEdit,
    }
  },
})
</script>
