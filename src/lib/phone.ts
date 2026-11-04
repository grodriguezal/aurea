/** Venezuelan mobile prefixes (after +58). */
const VE_MOBILE = /^\+584(12|14|16|22|24|26)\d{7}$/

/**
 * Normalises what people type ("0414-123 4567", "414 1234567", "+58 414…", "+1 305…")
 * to E.164, or null if it isn't a plausible WhatsApp number.
 */
export function toE164(input: string): string | null {
  const trimmed = input.trim()
  const digits = trimmed.replace(/\D/g, '')
  let e164: string
  if (trimmed.startsWith('+')) e164 = `+${digits}`
  else if (digits.startsWith('58') && digits.length === 12) e164 = `+${digits}`
  else if (digits.startsWith('0') && digits.length === 11) e164 = `+58${digits.slice(1)}`
  else if (digits.length === 10 && digits.startsWith('4')) e164 = `+58${digits}`
  else return null

  if (e164.startsWith('+58')) return VE_MOBILE.test(e164) ? e164 : null
  return /^\+[1-9]\d{7,14}$/.test(e164) ? e164 : null
}

/** "+584141234567" → "+58 414 123 4567"; other countries are left grouped as typed. */
export function formatPhone(e164: string) {
  const m = e164.match(/^\+58(\d{3})(\d{3})(\d{4})$/)
  return m ? `+58 ${m[1]} ${m[2]} ${m[3]}` : e164
}
