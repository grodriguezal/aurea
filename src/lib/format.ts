
export const number = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 2 })

/** Plain amounts for "USD 640 – 670", where the currency is written once in front. */
export const amount = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 0 })
export const amountCents = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
