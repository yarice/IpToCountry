import { ref } from 'vue'
import { lookupIp, IpLookupData } from '../services/ipService'
import { isIP } from 'is-ip'

export interface IpLookupState {
  loading: boolean
  error: string
  result: IpLookupData | null
}

export function useIpLookup() {
  const state = ref<IpLookupState>({
    loading: false,
    error: '',
    result: null,
  })

  const searchIp = async (ip: string): Promise<boolean> => {
    if (!isIP(ip)) {
      state.value.error = 'Please enter a valid IPv4 or IPv6 address'
      return false
    }

    state.value.loading = true
    state.value.error = ''

    const { success, data, error } = await lookupIp(ip)

    if (success && data) {
      Object.assign(state.value, { result: data, error: '', loading: false })
      return true
    } else {
      Object.assign(state.value, {
        error: error || 'Lookup failed',
        result: null,
        loading: false,
      })
      return false
    }
  }

  const clearResult = () => {
    Object.assign(state.value, { result: null, error: '', loading: false })
  }

  return {
    state,
    searchIp,
    clearResult,
  }
}
