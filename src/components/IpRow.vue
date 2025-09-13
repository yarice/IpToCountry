<template>
  <div class="ip-entry">
    <span class="ip-number">{{ index }}</span>
    <input
      type="text"
      v-model="currentIp"
      class="form-control"
      @blur="onBlur"
      @focus="handleFocus"
      :disabled="disabled"
    />
    <template v-if="loading">
      <span class="spinner"></span>
    </template>
    <template v-else-if="!error && flagUrl && time">
      <img :src="flagUrl" alt="flag" class="flag" />
      <span class="time">{{ time }}</span>
    </template>
    <template v-if="error">
      <span class="error">{{ error }}</span>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted } from 'vue'
import { lookupIp } from '../services/ipService'
import { isIP } from 'is-ip'

const ON_BLUR_DELAY = 200
const CLOCK_UPDATE_INTERVAL = 1000

export default defineComponent({
  name: 'IpRow',
  props: {
    index: Number,
    disabled: Boolean
  },
  emits: ['done', 'edit'],
  setup(_, { emit }) {
    const currentIp = ref('')
    const originalIp = ref('')
    const error = ref('')
    const flagUrl = ref('')
    const time = ref('')
    const isMounted = ref(true)
    const loading = ref(false)

    let timer: number | null = null


    const handleFocus = () => {
      originalIp.value = currentIp.value
      emit('edit')
    }

    const onBlur = () => {
      // Delay to make sure isMounted value is properly set - we don't want to search if the app is closed
      setTimeout(async () => {
        if (!isMounted.value) return
        if (currentIp.value !== originalIp.value) {
          if (!isIP(currentIp.value)) {
            error.value = 'Please enter a valid IPv4 or IPv6 address'
            return
          }
          await searchIp()
        }
          emit('done')
      }, ON_BLUR_DELAY)
    }

    const searchIp = async () => {
      loading.value = true
      error.value = ''
      try {
        const res = await lookupIp(currentIp.value)
        flagUrl.value = res.flag
        startClock(res.timezone)
      } catch (e: any) {
        error.value = e?.message || 'We could not find this IP right now. Please try again later.'
        flagUrl.value = ''
        time.value = ''
      } finally {
        loading.value = false
      }
    }

    const startClock = (timezone: string) => {
      //clear any existing timer to prevent multiple timers running simultaneously
      if (timer) clearInterval(timer)
      //update function that will be called every second
      const update = () => {
        const now = new Date().toLocaleTimeString('en-GB', { timeZone: timezone })
        time.value = now
      }
      //update immediately
      update()      
      //call update() every 1s
      timer = window.setInterval(update, CLOCK_UPDATE_INTERVAL)
    }

    onUnmounted(() => {
      isMounted.value = false
      if (timer) clearInterval(timer)
    })



    return { currentIp, error, flagUrl, time, loading, handleFocus, onBlur }
  }
})
</script>
