export const TROY_OZ_GRAMS = 31.1034768

export interface SpotPrice {
  /** USD per troy ounce of 24K gold */
  price: number
  timestamp: Date
}

const MAX_AGE_MS = 48 * 3600_000

/** Fetches the current XAU/USD reference price; rejects on stale or malformed data. */
export async function fetchSpotPrice(signal?: AbortSignal): Promise<SpotPrice> {
  const timeout = AbortSignal.timeout(9000)
  const response = await fetch('https://api.gold-api.com/price/XAU', {
    cache: 'no-store',
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  })
  if (!response.ok) throw new Error('Cotización no disponible')
  const data = await response.json()
  const price = Number(data.price)
  if (data.symbol !== 'XAU' || data.currency !== 'USD' || !Number.isFinite(price) || price <= 0) {
    throw new Error('Datos de cotización no válidos')
  }
  const timestamp = new Date(data.updatedAt || '')
  if (!Number.isFinite(timestamp.valueOf())) throw new Error('Cotización sin fecha verificable')
  if (Date.now() - timestamp.valueOf() > MAX_AGE_MS) throw new Error('Cotización demasiado antigua')
  return { price, timestamp }
}
