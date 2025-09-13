import { ref } from 'vue'
import { lookupIp, IpLookupResult } from '../services/ipService'
import { isIP } from 'is-ip'

export interface IpLookupState {
  loading: boolean
  error: string
  result: IpLookupResult | null
}

export function useIpLookup() {
  const state = ref<IpLookupState>({
    loading: false,
    error: '',
    result: null
  })

  const searchIp = async (ip: string): Promise<boolean> => {
    if (!isIP(ip)) {
      state.value.error = 'Please enter a valid IPv4 or IPv6 address'
      return false
    }

    state.value.loading = true
    state.value.error = ''
    
    const response = await lookupIp(ip)
    
    if (response.success && response.data) {
      state.value.result = response.data
      state.value.error = ''
      state.value.loading = false
      return true
    } else {
      state.value.error = response.error || 'Lookup failed'
      state.value.result = null
      state.value.loading = false
      return false
    }
  }

  const clearResult = () => {
    state.value.result = null
    state.value.error = ''
    state.value.loading = false
  }

  return {
    state,
    searchIp,
    clearResult
  }
}