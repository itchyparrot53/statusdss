import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const visitorMetaSchema = z.object({
  timeOnPageSeconds: z.number(),
  userAgent: z.string(),
  screenResolution: z.string(),
  viewportSize: z.string(),
  referrer: z.string(),
  timezone: z.string(),
  language: z.string(),
  pageUrl: z.string(),
})

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000),
  meta: visitorMetaSchema.optional(),
})

function getIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    'Unknown'
  )
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function parseUserAgent(ua: string): {
  browser: string
  os: string
  device: string
} {
  // Browser detection
  let browser = 'Unknown'
  if (ua.includes('Edg/')) browser = 'Edge'
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera'
  else if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari')) browser = 'Safari'

  // OS detection
  let os = 'Unknown'
  if (ua.includes('Windows NT 10')) os = 'Windows 10/11'
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1'
  else if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac OS X')) os = 'macOS'
  else if (ua.includes('iPhone')) os = 'iOS (iPhone)'
  else if (ua.includes('iPad')) os = 'iPadOS'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('Linux')) os = 'Linux'

  // Device type
  let device = 'Desktop'
  if (ua.includes('Mobile') || ua.includes('iPhone')) device = 'Mobile'
  else if (ua.includes('iPad') || ua.includes('Tablet')) device = 'Tablet'

  return { browser, os, device }
}

function buildEmailHtml(opts: {
  name: string
  email: string
  message: string
  ip: string
  submittedAt: string
  meta?: z.infer<typeof visitorMetaSchema>
}): string {
  const { name, email, message, ip, submittedAt, meta } = opts
  const { browser, os, device } = meta
    ? parseUserAgent(meta.userAgent)
    : { browser: 'N/A', os: 'N/A', device: 'N/A' }

  const timeOnPage = meta ? formatDuration(meta.timeOnPageSeconds) : 'N/A'

  // Sanitise user-supplied strings for safe HTML output
  function escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  }

  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

  const metaRow = (label: string, value: string) => `
    <tr>
      <td style="padding: 6px 0; color: rgba(255,255,255,0.4); font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap; padding-right: 20px; vertical-align: top;">${label}</td>
      <td style="padding: 6px 0; color: rgba(255,255,255,0.75); font-size: 12px; word-break: break-all;">${value}</td>
    </tr>`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New message from ${safeName}</title>
</head>
<body style="margin: 0; padding: 0; background: #06060d; font-family: ui-monospace, 'SF Mono', 'Fira Code', monospace; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #06060d; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 620px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-size: 16px; font-weight: 700; color: #fff; letter-spacing: 0.2em; text-transform: uppercase;">AM</span>
                  </td>
                  <td align="right">
                    <span style="font-size: 10px; color: rgba(255,255,255,0.25); letter-spacing: 0.1em; text-transform: uppercase;">Portfolio Contact</span>
                  </td>
                </tr>
              </table>
              <div style="height: 1px; background: linear-gradient(to right, #8b5cf6, transparent); margin-top: 16px;"></div>
            </td>
          </tr>

          <!-- Hero label -->
          <tr>
            <td style="padding-bottom: 8px;">
              <span style="font-size: 10px; color: #8b5cf6; letter-spacing: 0.2em; text-transform: uppercase;">— New Message</span>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom: 32px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -0.02em; line-height: 1.1;">
                ${safeName} got in touch
              </h1>
            </td>
          </tr>

          <!-- Sender card -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(139,92,246,0.06); border: 1px solid rgba(139,92,246,0.2); border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0">
                      ${metaRow('Name', safeName)}
                      ${metaRow('Email', `<a href="mailto:${safeEmail}" style="color: #8b5cf6; text-decoration: none;">${safeEmail}</a>`)}
                      ${metaRow('Sent at', submittedAt)}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding-bottom: 24px;">
              <div style="font-size: 10px; color: #8b5cf6; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">— Message</div>
              <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-left: 2px solid #8b5cf6; border-radius: 4px; padding: 20px 24px; font-size: 14px; line-height: 1.75; color: rgba(255,255,255,0.8);">
                ${safeMessage}
              </div>
            </td>
          </tr>

          <!-- Analytics -->
          <tr>
            <td style="padding-bottom: 8px;">
              <div style="font-size: 10px; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px;">— Visitor Analytics</div>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 20px;">
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      ${metaRow('IP Address', ip)}
                      ${metaRow('Time on Page', timeOnPage)}
                      ${metaRow('Device', device)}
                      ${metaRow('Browser', browser)}
                      ${metaRow('OS', os)}
                      ${metaRow('Screen', meta?.screenResolution ?? 'N/A')}
                      ${metaRow('Viewport', meta?.viewportSize ?? 'N/A')}
                      ${metaRow('Timezone', meta?.timezone ?? 'N/A')}
                      ${metaRow('Language', meta?.language ?? 'N/A')}
                      ${metaRow('Referrer', meta?.referrer ?? 'N/A')}
                      ${metaRow('Page URL', meta?.pageUrl ?? 'N/A')}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- User agent raw -->
          <tr>
            <td style="padding-bottom: 32px; padding-top: 12px;">
              <div style="background: rgba(0,0,0,0.3); border-radius: 4px; padding: 12px 16px;">
                <div style="font-size: 9px; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px;">Raw User Agent</div>
                <div style="font-size: 10px; color: rgba(255,255,255,0.35); word-break: break-all; line-height: 1.6;">${meta?.userAgent ?? 'N/A'}</div>
              </div>
            </td>
          </tr>

          <!-- Reply CTA -->
          <tr>
            <td style="padding-bottom: 40px;">
              <a href="mailto:${safeEmail}?subject=Re: Your message&body=Hi ${safeName},%0A%0A"
                style="display: inline-block; padding: 12px 24px; background: #8b5cf6; color: #fff; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; border-radius: 4px; font-weight: 600;">
                Reply to ${safeName} →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <div style="height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 20px;"></div>
              <p style="margin: 0; font-size: 10px; color: rgba(255,255,255,0.2); letter-spacing: 0.08em; line-height: 1.8;">
                Sent from your portfolio contact form at aidanmunns.dev<br>
                This email was triggered automatically — do not reply to this address.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { name, email, message, meta } = parsed.data
    // Strip newlines to prevent email header injection
    const safeName = name.replace(/[\r\n]+/g, ' ').trim()
    const ip = getIp(request)
    const to = process.env.CONTACT_EMAIL ?? 'aidanmunns@gmail.com'
    const submittedAt = new Date().toLocaleString('en-GB', {
      dateStyle: 'full',
      timeStyle: 'long',
      timeZone: 'Europe/London',
    })

    const html = buildEmailHtml({
      name: safeName,
      email,
      message,
      ip,
      submittedAt,
      ...(meta !== undefined ? { meta } : {}),
    })

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to,
      replyTo: email,
      subject: `[Portfolio] New message from ${safeName}`,
      text: [
        `From: ${safeName} <${email}>`,
        `Sent: ${submittedAt}`,
        `IP: ${ip}`,
        `Time on page: ${meta ? formatDuration(meta.timeOnPageSeconds) : 'N/A'}`,
        `Browser: ${meta ? parseUserAgent(meta.userAgent).browser : 'N/A'}`,
        `Device: ${meta ? parseUserAgent(meta.userAgent).device : 'N/A'}`,
        `Referrer: ${meta?.referrer ?? 'N/A'}`,
        '',
        '--- Message ---',
        message,
      ].join('\n'),
      html,
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
