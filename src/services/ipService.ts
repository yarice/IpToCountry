export interface IpLookupResult {
  country: string
  flag: string
  timezone: string
}

export interface IpLookupResponse {
  success: boolean
  data?: IpLookupResult
  error?: string
}

export async function lookupIp(ip: string): Promise<IpLookupResponse> {
  try {
    const res = await fetch(`https://ipwho.is/${ip}`)
    if (!res.ok) {
      return {
        success: false,
        error: `HTTP ${res.status}: ${res.statusText}`
      }
    }
    
    const data = await res.json()
    if (!data.success) {
      return {
        success: false,
        error: data?.message || 'Lookup failed'
      }
    }

    return {
      success: true,
      data: {
        country: data.country,
        flag: `https://flagcdn.com/${data.country_code.toLowerCase()}.svg`,
        timezone: data.timezone.id,
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}
