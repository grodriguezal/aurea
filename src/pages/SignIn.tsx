import { useEffect, useRef, useState, type FormEvent } from 'react'
import Logo from '../components/Logo.tsx'
import { api, ApiError, MOCK_CODE } from '../lib/api.ts'
import { formatPhone, toE164 } from '../lib/phone.ts'
import { navigate } from '../lib/route.ts'
import { setSession } from '../lib/session.ts'

const CODE_LENGTH = 6
const RESEND_SECONDS = 30

export default function SignIn() {
  const [phoneInput, setPhoneInput] = useState('')
  const [phone, setPhone] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const sendCode = async (to: string) => {
    setBusy(true)
    setError('')
    try {
      await api.requestCode(to)
      setPhone(to)
      setCode('')
      setCooldown(RESEND_SECONDS)
      requestAnimationFrame(() => codeRef.current?.focus())
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos enviar el código. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  const submitPhone = (e: FormEvent) => {
    e.preventDefault()
    const e164 = toE164(phoneInput)
    if (!e164) {
      setError('Escribe un número de WhatsApp válido, por ejemplo 0414 123 4567.')
      return
    }
    void sendCode(e164)
  }

  const verify = async (value: string) => {
    if (!phone || value.length !== CODE_LENGTH) return
    setBusy(true)
    setError('')
    try {
      setSession(await api.verifyCode(phone, value))
      navigate('chat', { replace: true })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'No pudimos verificar el código. Inténtalo de nuevo.')
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <header className="app-bar">
        <Logo />
        <a className="text-button app-bar-link" href="#inicio">Volver</a>
      </header>

      <main className="auth-main" id="contenido">
        <div className="panel auth-card">
          <div className="panel-head">
            <p className="eyebrow"><span aria-hidden="true">✦</span> Entra con WhatsApp</p>
            {phone === null ? (
              <>
                <h1 className="result-title">Empecemos por tu WhatsApp</h1>
                <p>Te enviaremos un código para verificar tu número. Si es tu primera vez, creamos tu cuenta al instante.</p>
              </>
            ) : (
              <>
                <h1 className="result-title">Escribe el código</h1>
                <p>Te lo enviamos por WhatsApp al <strong>{formatPhone(phone)}</strong>.</p>
              </>
            )}
          </div>

          {phone === null ? (
            <form className="auth-form" onSubmit={submitPhone} noValidate>
              <label className="field">
                <span className="field-label">Número de WhatsApp</span>
                <span className="field-box">
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="0414 123 4567"
                    value={phoneInput}
                    onChange={(e) => {
                      setPhoneInput(e.target.value)
                      setError('')
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'auth-error' : undefined}
                    autoFocus
                  />
                </span>
              </label>
              <button type="submit" className="button button-dark button-full" disabled={busy || !phoneInput.trim()}>
                {busy ? 'ENVIANDO…' : 'RECIBIR CÓDIGO POR WHATSAPP'}
              </button>
            </form>
          ) : (
            <form
              className="auth-form"
              onSubmit={(e) => {
                e.preventDefault()
                void verify(code)
              }}
              noValidate
            >
              <label className="field">
                <span className="field-label">Código de {CODE_LENGTH} dígitos</span>
                <span className="field-box">
                  <input
                    ref={codeRef}
                    className="code-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={CODE_LENGTH}
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => {
                      const next = e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH)
                      setCode(next)
                      setError('')
                      if (next.length === CODE_LENGTH) void verify(next)
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'auth-error' : undefined}
                  />
                </span>
              </label>
              <button type="submit" className="button button-dark button-full" disabled={busy || code.length !== CODE_LENGTH}>
                {busy ? 'VERIFICANDO…' : 'ENTRAR'}
              </button>
              <div className="auth-actions">
                <button type="button" className="text-button" onClick={() => { setPhone(null); setError('') }}>Cambiar número</button>
                <button type="button" className="text-button" disabled={cooldown > 0 || busy} onClick={() => void sendCode(phone)}>
                  {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar código'}
                </button>
              </div>
            </form>
          )}

          {error && <p className="form-error" id="auth-error" role="alert">{error}</p>}

          {api.mock && (
            <p className="mock-note">
              <strong>Modo de prueba:</strong> no se envían mensajes reales.{phone !== null && <> Usa el código <b>{MOCK_CODE}</b>.</>}
            </p>
          )}
          <p className="fine-print">Al continuar aceptas que te escribamos por WhatsApp sobre tu consulta y tus citas. No compartimos tu número.</p>
        </div>
      </main>
    </div>
  )
}
