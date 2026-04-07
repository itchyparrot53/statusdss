'use client'

import type { ChangeEvent, FormEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import s from './contact.module.css'

interface FormState {
  name: string
  email: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

interface VisitorMeta {
  timeOnPageSeconds: number
  userAgent: string
  screenResolution: string
  viewportSize: string
  referrer: string
  timezone: string
  language: string
  pageUrl: string
}

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {}
  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Please enter a valid email address'
  if (!form.message.trim()) errors.message = 'Message is required'
  else if (form.message.trim().length < 10)
    errors.message = 'Message must be at least 10 characters'
  return errors
}

export function Contact() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const entryTime = useRef<number>(Date.now())

  useEffect(() => {
    entryTime.current = Date.now()
  }, [])

  function getVisitorMeta(): VisitorMeta {
    const elapsed = Math.round((Date.now() - entryTime.current) / 1000)
    return {
      timeOnPageSeconds: elapsed,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}×${screen.height}`,
      viewportSize: `${window.innerWidth}×${window.innerHeight}`,
      referrer: document.referrer || 'Direct / None',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      pageUrl: window.location.href,
    }
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const newErrors = validate(form)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, meta: getVisitorMeta() }),
      })
      const data: { success?: boolean; error?: string } = await res.json()
      if (res.ok && data.success) {
        setStatus('success')
        setStatusMessage("Message sent — I'll get back to you shortly.")
        setForm({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
        setStatusMessage(
          data.error ?? 'Something went wrong. Please try again.'
        )
      }
    } catch {
      setStatus('error')
      setStatusMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className={s.root} id="contact" aria-label="Contact">
      <div>
        <p className={s.label}>Contact</p>
        <h2 className={s.heading}>Let&apos;s talk.</h2>
        <p className={s.subtext}>
          Got a project in mind? A security question? Want to collaborate on
          something open-source? Drop me a message &mdash; I read everything.
        </p>
      </div>

      <form className={s.form} onSubmit={handleSubmit} noValidate>
        <div className={s.field}>
          <label htmlFor="name" className={s.fieldLabel}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            className={s.input}
            disabled={status === 'loading'}
          />
          {errors.name && <span className={s.fieldError}>{errors.name}</span>}
        </div>

        <div className={s.field}>
          <label htmlFor="email" className={s.fieldLabel}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="your@email.com"
            value={form.email}
            onChange={handleChange}
            className={s.input}
            disabled={status === 'loading'}
          />
          {errors.email && <span className={s.fieldError}>{errors.email}</span>}
        </div>

        <div className={s.field}>
          <label htmlFor="message" className={s.fieldLabel}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="What's on your mind?"
            value={form.message}
            onChange={handleChange}
            className={s.textarea}
            disabled={status === 'loading'}
          />
          {errors.message && (
            <span className={s.fieldError}>{errors.message}</span>
          )}
        </div>

        {status === 'success' && (
          <div className={s.statusSuccess} role="status">
            {statusMessage}
          </div>
        )}
        {status === 'error' && (
          <div className={s.statusError} role="alert">
            {statusMessage}
          </div>
        )}

        <button
          type="submit"
          className={s.submit}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Sending...' : 'Send message →'}
        </button>
      </form>
    </section>
  )
}
