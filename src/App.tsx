import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import heroBlur from './assets/hero-blur.jpg'
import landscape from './assets/landscape.jpg'
import { supabase } from './lib/supabase'

const sloganLineOne = ['Immerse', 'yourself', 'in', 'true']
const sloganLineTwo = ['visual', 'storytelling']
const dashTitle = ['Coming', 'soon'] as const
const dashLine = ['The', 'house', 'is', 'still', 'being', 'built.'] as const
const clarifyStep = 90

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function ClarifyWords({
  words,
  from = 0,
}: {
  words: readonly string[]
  from?: number
}) {
  return words.map((word, index) => (
    <span
      key={`${word}-${index}`}
      className="slogan__word"
      style={{ animationDelay: `${(from + index) * clarifyStep}ms` }}
    >
      {word}
    </span>
  ))
}

const stills = [
  {
    index: '01',
    title: 'Discover',
    copy: 'Find original short films and voices you may not encounter anywhere else.',
    position: '22% 82%',
  },
  {
    index: '02',
    title: 'Support',
    copy: 'Rate films, save your favorites, and help meaningful work reach new audiences.',
    position: '68% 18%',
  },
  {
    index: '03',
    title: 'Create',
    copy: 'Share your perspective and inspire the next generation of filmmakers.',
    position: '48% 100%',
  },
] as const

type AuthMode = 'signup' | 'login'

function authFailure(message: string) {
  const lower = message.toLowerCase()
  if (lower.includes('email not confirmed')) {
    return 'Confirm your email first, then log in.'
  }
  if (lower.includes('invalid login credentials')) {
    return 'That email and password don’t match.'
  }
  return message
}

function App() {
  const [compact, setCompact] = useState(() => window.scrollY > 72)
  const [navReady, setNavReady] = useState(false)
  const [auth, setAuth] = useState<AuthMode | null>(null)
  const [authNote, setAuthNote] = useState('')
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [accountEmail, setAccountEmail] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [landingMounted, setLandingMounted] = useState(false)
  const [dashMounted, setDashMounted] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const sawLanding = useRef(false)
  const onDashboard = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      setCompact(window.scrollY > 72)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let cancelled = false
    const frames: number[] = []

    const arm = () => {
      const next = (remaining: number) => {
        if (cancelled) return
        if (remaining <= 0) {
          setNavReady(true)
          return
        }
        frames.push(requestAnimationFrame(() => next(remaining - 1)))
      }
      next(3)
    }

    const fallback = window.setTimeout(arm, 800)

    const settle = async () => {
      try {
        if (document.fonts) {
          await Promise.all([
            document.fonts.load('600 0.72rem Manrope'),
            document.fonts.load('500 2.7rem Manrope'),
            document.fonts.ready,
          ])
        }
      } catch {
        /* Fallback metrics stay in place. */
      }
      window.clearTimeout(fallback)
      if (!cancelled) arm()
    }

    void settle()

    return () => {
      cancelled = true
      window.clearTimeout(fallback)
      for (const frame of frames) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    if (!navReady) return
    document.documentElement.classList.add('is-smooth-scroll')
    return () => document.documentElement.classList.remove('is-smooth-scroll')
  }, [navReady])

  useEffect(() => {
    if (!compact) return
    const active = document.activeElement
    if (
      active instanceof HTMLElement &&
      active.closest('.auth-pill, .wordmark')
    ) {
      active.blur()
    }
  }, [compact])

  useEffect(() => {
    if (!auth) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAuth(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [auth])

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true)
      return
    }

    let ignore = false
    void supabase.auth.getSession().then(({ data }) => {
      if (ignore) return
      setAccountEmail(data.session?.user.email ?? null)
      setAuthReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAccountEmail(session?.user.email ?? null)
      setAuthReady(true)
    })
    return () => {
      ignore = true
      data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!authReady) return

    if (!accountEmail) {
      onDashboard.current = false
      setLeaving(false)
      setDashMounted(false)
      setLandingMounted(true)
      sawLanding.current = true
      return
    }

    if (onDashboard.current) return

    const finish = () => {
      onDashboard.current = true
      setLandingMounted(false)
      setLeaving(false)
      setDashMounted(true)
    }

    if (!sawLanding.current || prefersReducedMotion()) {
      finish()
      return
    }

    setLeaving(true)
    const showDash = window.setTimeout(() => {
      setDashMounted(true)
      window.scrollTo(0, 0)
    }, 240)
    const hideLanding = window.setTimeout(finish, 640)
    return () => {
      window.clearTimeout(showDash)
      window.clearTimeout(hideLanding)
    }
  }, [accountEmail, authReady])

  useEffect(() => {
    if (!leaving) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [leaving])

  const openAuth = (mode: AuthMode) => {
    setAuthNote('')
    setAuthError('')
    setAuth(mode)
  }

  const onSignOut = () => {
    void supabase?.auth.signOut()
  }

  const onAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!auth || authBusy) return
    if (!supabase) {
      setAuthError('Accounts are not connected on this copy of the site.')
      return
    }
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '').trim()
    const password = String(form.get('password') ?? '')
    setAuthBusy(true)
    setAuthError('')
    setAuthNote('')

    if (auth === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      })
      setAuthBusy(false)
      if (error) {
        setAuthError(authFailure(error.message))
        return
      }
      if (data.session) {
        setAuth(null)
        return
      }
      setAuthNote('Check your email to confirm this account, then log in.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setAuthBusy(false)
    if (error) {
      setAuthError(authFailure(error.message))
      return
    }
    setAuth(null)
  }

  if (!authReady) {
    return (
      <div className="page">
        <Backdrop />
      </div>
    )
  }

  return (
    <div className="page">
      <Backdrop />

      {landingMounted ? (
        <div
          className={`landing${leaving ? ' is-leaving' : ''}`}
          inert={leaving || undefined}
        >
      <a className="skip" href="#about">
        Skip to content
      </a>

      <header
        className={`masthead ${compact ? 'is-compact' : ''} ${navReady ? 'is-ready' : ''}`}
      >
        <div className="masthead__cluster">
          <nav className="nav-pill" aria-label="Primary">
            <a
              className="wordmark"
              href="#top"
              tabIndex={compact ? -1 : undefined}
              aria-hidden={compact}
            >
              Cine Bohio
            </a>
            <ul className="nav-links">
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a href="#location">Location</a>
              </li>
            </ul>
          </nav>
          <div className="auth-slot" inert={compact || undefined}>
            <div className="auth-pill">
              <button
                type="button"
                className="btn btn--solid"
                onClick={() => openAuth('signup')}
              >
                Sign Up
              </button>
              <button
                type="button"
                className="btn btn--glass"
                onClick={() => openAuth('login')}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="hero" id="top" aria-label="Cine Bohio">
          <h1 className="slogan">
            <span className="slogan__line">
              <ClarifyWords words={sloganLineOne} />
            </span>
            <span className="slogan__line">
              <ClarifyWords
                words={sloganLineTwo}
                from={sloganLineOne.length}
              />
            </span>
          </h1>

          <a className="scroll-cue" href="#about" aria-label="Scroll to about">
            <span className="scroll-cue__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <svg viewBox="0 0 16 30" aria-hidden="true">
              <path
                d="M2 10 L8 18 L14 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </section>

        <section className="panel" id="about">
          <div className="panel__inner glass">
            <p className="eyebrow">About</p>
            <h2>
              A home for short films.
              <br />
              A movement for creators.
            </h2>
            <p>
              Cine Bohío is a platform where filmmakers can share their work and
              audiences can discover stories worth remembering. Born in Puerto
              Rico, we are building a community that encourages more people to
              watch, support, and create cinema.
            </p>
            <p className="panel__emphasis">Puerto Rican roots. Global stories.</p>
          </div>
        </section>

        <section className="panel panel--stills" id="concept" aria-labelledby="concept-title">
          <div className="panel__inner">
            <p className="eyebrow">The Movement</p>
            <h2 id="concept-title">Watch. Support. Create.</h2>
            <p className="lede">
              Cine Bohío brings audiences and filmmakers together through
              short-form cinema.
            </p>
            <ul className="stills">
              {stills.map((still) => (
                <li key={still.title} className="still glass">
                  <div className="still__frame">
                    <img
                      src={landscape}
                      alt=""
                      style={{ objectPosition: still.position }}
                    />
                  </div>
                  <p className="still__index" aria-hidden="true">
                    {still.index}
                  </p>
                  <h3>{still.title}</h3>
                  <p>{still.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel" id="location">
          <div className="panel__inner glass location">
            <p className="eyebrow">Our Roots</p>
            <h2>
              Born in Puerto Rico.
              <br />
              Open to the world.
            </h2>
            <p>
              Cine Bohío begins by creating a dedicated home for Puerto Rican
              short films and the people behind them. As the movement grows, we
              will welcome stories from across the Caribbean and the world—without
              losing sight of where it began.
            </p>
          </div>
        </section>

        <section className="panel" id="contact">
          <div className="panel__inner glass contact">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Bring your story to the house.</h2>
              <p>
                Filmmakers, festivals, collaborators, and viewers—help us build
                the next chapter of Cine Bohío.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
        </div>
      ) : null}

      {dashMounted && accountEmail ? (
        <Dashboard email={accountEmail} onSignOut={onSignOut} />
      ) : null}

      {auth ? (
        <AuthDialog
          mode={auth}
          note={authNote}
          error={authError}
          busy={authBusy}
          onClose={() => setAuth(null)}
          onSubmit={onAuthSubmit}
          onSwitch={(mode) => {
            setAuthNote('')
            setAuthError('')
            setAuth(mode)
          }}
        />
      ) : null}
    </div>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const id = useId()

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(true)
  }

  if (sent) {
    return (
      <p className="form-note" role="status">
        Received. We’ll reply when we can sit with it properly.
      </p>
    )
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <label htmlFor={`${id}-name`}>Name</label>
      <input id={`${id}-name`} name="name" autoComplete="name" required />
      <label htmlFor={`${id}-email`}>Email</label>
      <input
        id={`${id}-email`}
        name="email"
        type="email"
        autoComplete="email"
        required
      />
      <label htmlFor={`${id}-message`}>Message</label>
      <textarea id={`${id}-message`} name="message" rows={4} required />
      <button className="btn btn--solid" type="submit">
        Send
      </button>
    </form>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="12"
        r="2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3 4.5 20 19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M9.2 6.4A10 10 0 0 1 12 6c6.5 0 10 6 10 6a16 16 0 0 1-3.2 3.7M6.1 8.2C3.7 9.8 2 12 2 12s3.5 6 10 6a9.6 9.6 0 0 0 3.4-.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function AuthDialog({
  mode,
  note,
  error,
  busy,
  onClose,
  onSubmit,
  onSwitch,
}: {
  mode: AuthMode
  note: string
  error: string
  busy: boolean
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSwitch: (mode: AuthMode) => void
}) {
  const id = useId()
  const emailRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const title = mode === 'signup' ? 'Sign up' : 'Log in'

  useEffect(() => {
    setShowPassword(false)
    emailRef.current?.focus()
  }, [mode])

  return (
    <div className="dialog-back" role="presentation" onClick={onClose}>
      <div
        className="dialog glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={`${id}-title`}>{title}</h2>
        <p>
          {mode === 'signup'
            ? 'Create an account with your email. Confirm the message we send before the seat is open.'
            : 'Log in with the email and password for your account.'}
        </p>
        <form className="form" onSubmit={onSubmit}>
          <label htmlFor={`${id}-email`}>Email</label>
          <input
            ref={emailRef}
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={busy}
            aria-invalid={error ? true : undefined}
          />
          <label htmlFor={`${id}-password`}>Password</label>
          <div className="password-field">
            <input
              id={`${id}-password`}
              name="password"
              type={mode === 'signup' && showPassword ? 'text' : 'password'}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength={6}
              required
              disabled={busy}
              aria-invalid={error ? true : undefined}
            />
            {mode === 'signup' ? (
              <button
                type="button"
                className="password-toggle"
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={busy}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            ) : null}
          </div>
          <button className="btn btn--solid" type="submit" disabled={busy}>
            {busy ? 'Please wait' : title}
          </button>
        </form>
        {error ? (
          <p className="form-note" role="alert">
            {error}
          </p>
        ) : null}
        {note ? (
          <p className="form-note" role="status">
            {note}
          </p>
        ) : null}
        <p className="dialog__switch">
          {mode === 'signup' ? (
            <button type="button" onClick={() => onSwitch('login')} disabled={busy}>
              Have a seat already? Log in
            </button>
          ) : (
            <button type="button" onClick={() => onSwitch('signup')} disabled={busy}>
              New here? Sign up
            </button>
          )}
        </p>
        <button type="button" className="dialog__close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}

function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <img src={heroBlur} alt="" />
    </div>
  )
}

const profileItems = ['Profile', 'Watchlist', 'Settings', 'Notifications'] as const

function initialsFromEmail(email: string) {
  const local = email.split('@')[0] ?? email
  const parts = local.split(/[._-]+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
  }
  return local.slice(0, 2).toUpperCase()
}

function Dashboard({
  email,
  onSignOut,
}: {
  email: string
  onSignOut: () => void
}) {
  const [chromeSettled, setChromeSettled] = useState(false)

  return (
    <div className="dash-view">
      <a className="skip" href="#dash-main">
        Skip to content
      </a>
      <header className="dash-masthead">
        <div
          className={`dash-bar clarify-ui${chromeSettled ? ' is-settled' : ''}`}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setChromeSettled(true)
          }}
        >
          <p className="wordmark dash-wordmark">Cine Bohio</p>
          <ProfileMenu email={email} onSignOut={onSignOut} />
        </div>
      </header>
      <main className="dash-main" id="dash-main">
        <h1 className="slogan">
          <span className="slogan__line">
            <ClarifyWords words={dashTitle} from={2} />
          </span>
        </h1>
        <p className="dash-line">
          <ClarifyWords words={dashLine} from={4} />
        </p>
      </main>
    </div>
  )
}

function ProfileMenu({
  email,
  onSignOut,
}: {
  email: string
  onSignOut: () => void
}) {
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const onPointer = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    const listen = window.setTimeout(() => {
      window.addEventListener('pointerdown', onPointer)
    }, 0)
    window.addEventListener('keydown', onKey)
    return () => {
      window.clearTimeout(listen)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="profile" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="profile__trigger"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={(event) => {
          event.stopPropagation()
          setOpen((value) => !value)
        }}
      >
        <span className="profile__avatar" aria-hidden="true">
          {initialsFromEmail(email)}
        </span>
        <span className="profile__meta">
          <span className="profile__label">Your account</span>
          <span className="profile__email">{email}</span>
        </span>
      </button>
      {open ? (
        <div className="profile__menu glass" id={menuId} role="menu" aria-label="Account">
          {profileItems.map((item) => (
            <button
              key={item}
              type="button"
              role="menuitem"
              className="profile__item"
              disabled
              title="Coming soon"
            >
              {item}
            </button>
          ))}
          <button
            type="button"
            role="menuitem"
            className="profile__item profile__item--out"
            onClick={onSignOut}
          >
            Log out
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default App
