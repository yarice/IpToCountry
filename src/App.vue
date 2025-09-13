<template>
  <div>
    <div v-if="visible" class="app">
      <div class="header">
        <h3>IP Lookup</h3>
        <button class="close-btn" @click="closeApp">&times;</button>
      </div>
      <p class="subtitle">
        Enter one or more IP addresses and get their country
      </p>

      <button class="btn-primary" @click="addRow" :disabled="hasActiveRow">
        + Add
      </button>

      <div class="rows">
        <div v-for="i in rowCount" :key="i" class="row-wrapper">
          <IpRow
            :index="i"
            :disabled="hasActiveRow && !isRowActive(i)"
            @done="clearActiveRow"
            @edit="() => setActiveRow(i)"
          />
        </div>
      </div>
    </div>

    <div v-else class="reopen">
      <button class="btn-primary" @click="visible = true">
        Open IP Lookup
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import IpRow from './components/IpRow.vue'

export default defineComponent({
  components: { IpRow },
  setup() {
    const visible = ref(true)
    const rowCount = ref(0)
    const activeRowIndex = ref<number | null>(null)

    const clearActiveRow = () => {
      activeRowIndex.value = null
    }

    const setActiveRow = (index: number) => {
      activeRowIndex.value = index
    }

    const hasActiveRow = computed(() => {
      return activeRowIndex.value !== null
    })

    const isRowActive = (index: number) => {
      return activeRowIndex.value === index
    }

    const addRow = () => {
      rowCount.value++
      setActiveRow(rowCount.value)
    }

    const closeApp = () => {
      rowCount.value = 0
      clearActiveRow()
      visible.value = false
    }

    return {
      rowCount,
      addRow,
      visible,
      closeApp,
      clearActiveRow,
      setActiveRow,
      hasActiveRow,
      isRowActive,
    }
  },
})
</script>
