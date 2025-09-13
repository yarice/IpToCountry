export interface IpLookupResult {
  country: string;
  flag: string;
  timezone: string;
}

export async function lookupIp(ip: string): Promise<IpLookupResult> {
const res = await fetch(`https://ipwho.is/${ip}`);
if (!res.ok) {
throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}
const data = await res.json();

if (!data.success) {
throw new Error(data?.message || "Lookup failed");
}

return {
country: data.country,
flag: `https://flagcdn.com/${data.country_code.toLowerCase()}.svg`,
timezone: data.timezone.id,
};
}
