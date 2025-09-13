<template>
  <div class="ip-entry">
    <span class="ip-number">{{ index }}</span>
    <input
      type="text"
      v-model="ip"
      class="form-control"
      @blur="onBlur"
      @focus="handleFocus"
      :disabled="disabled"
    />
    <template v-if="state && state.loading">
      <span class="spinner"></span>
    </template>
    <template v-else-if="state && state.result && time">
      <img :src="state.result.flag" alt="flag" class="flag" />
      <span class="time">{{ time }}</span>
    </template>
    <template v-if="state && state.error">
      <span class="error">{{ state.error }}</span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useIpLookup } from '../composables/useIpLookup'
import { useTimer } from '../composables/useTimer'

export default defineComponent({
  name: 'IpRow',
  props: {
    index: Number,
    disabled: Boolean,
    rowId: String,
  },
  emits: ['done', 'edit'],
  setup(props, { emit }) {
    const ip = ref('')

    const { state, searchIp } = useIpLookup()
    const { time, startClock, stopClock } = useTimer()

    const handleFocus = () => {
      emit('edit', props.rowId)
    }

    const onBlur = async () => {
      if (ip.value.trim()) {
        const success = await searchIp(ip.value)

        if (success && state.value.result) {
          startClock(state.value.result.timezone)
          emit('done')
        } else {
          stopClock()
        }
      }
    }

    return {
      ip,
      state,
      time,
      handleFocus,
      onBlur,
    }
  },
})
</script>
