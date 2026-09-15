import { useEffect, useId, useState } from 'react'
import type { FormEvent } from 'react'
import heroBlur from './assets/hero-blur.jpg'
import landscape from './assets/landscape.jpg'

const sloganLineOne = ['Immerse', 'yourself', 'in', 'true']
const sloganLineTwo = ['visual', 'storytelling']

const stills = [
  {
    title: 'The trail',
    copy: 'A path cut through rock and light.',
    position: '22% 82%',
  },
  {
    title: 'The peak',
    copy: 'Snow, distance, and the frame that holds them.',
    position: '68% 18%',
  },
  {
    title: 'The ground',
    copy: 'Texture first — then the story walking through it.',
    position: '48% 100%',
  },
] as const

type AuthMode = 'signup' | 'login'

function App() {
  const [compact, setCompact] = useState(() => window.scrollY > 72)
  const [navReady, setNavReady] = useState(false)
  const [auth, setAuth] = useState<AuthMode | null>(null)
  const [authNote, setAuthNote] = useState('')

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

  const onAuthSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthNote(
      auth === 'signup'
        ? 'Accounts will open with the catalog. We’ll keep this seat for you.'
        : 'Login will connect when the catalog goes live.',
    )
  }

  return (
    <div className="page">
      <div className="backdrop" aria-hidden="true">
        <img src={heroBlur} alt="" />
      </div>

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
                onClick={() => {
                  setAuthNote('')
                  setAuth('signup')
                }}
              >
                Sign Up
              </button>
              <button
                type="button"
                className="btn btn--glass"
                onClick={() => {
                  setAuthNote('')
                  setAuth('login')
                }}
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
              {sloganLineOne.map((word, index) => (
                <span
                  key={word}
                  className="slogan__word"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  {word}
                </span>
              ))}
            </span>
            <span className="slogan__line">
              {sloganLineTwo.map((word, index) => (
                <span
                  key={word}
                  className="slogan__word"
                  style={{
                    animationDelay: `${(sloganLineOne.length + index) * 90}ms`,
                  }}
                >
                  {word}
                </span>
              ))}
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
            <h2>A house for short films that stay with you.</h2>
            <p>
              Cine Bohio is a streaming home for shorts — work that treats
              image, sound, and silence as the story, not the decoration. We
              gather films that feel lived-in: landscapes you can almost walk,
              faces held a beat longer, light that does the talking.
            </p>
            <p>
              The bohío is a dwelling. This one is built for watching closely.
            </p>
          </div>
        </section>

        <section className="panel panel--stills" id="concept" aria-labelledby="concept-title">
          <div className="panel__inner">
            <p className="eyebrow">Concept</p>
            <h2 id="concept-title">Still from the world</h2>
            <p className="lede">
              Production stills from the same ground as the landing — trail,
              peak, and the dust underfoot.
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
                  <h3>{still.title}</h3>
                  <p>{still.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel" id="contact">
          <div className="panel__inner glass contact">
            <div>
              <p className="eyebrow">Contact</p>
              <h2>Write to the house.</h2>
              <p>
                Festivals, filmmakers, and viewers — send a note. We read
                everything that arrives.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>

        <section className="panel" id="location">
          <div className="panel__inner glass location">
            <p className="eyebrow">Location</p>
            <h2>Wherever the frame is honest.</h2>
            <p>
              Cine Bohio is rooted in Caribbean storytelling and open to films
              shot on any soil that still has weather in it — like the high
              trail in the image behind this page.
            </p>
          </div>
        </section>
      </main>

      {auth ? (
        <AuthDialog
          mode={auth}
          note={authNote}
          onClose={() => setAuth(null)}
          onSubmit={onAuthSubmit}
          onSwitch={(mode) => {
            setAuthNote('')
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

function AuthDialog({
  mode,
  note,
  onClose,
  onSubmit,
  onSwitch,
}: {
  mode: AuthMode
  note: string
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onSwitch: (mode: AuthMode) => void
}) {
  const id = useId()
  const title = mode === 'signup' ? 'Sign up' : 'Log in'

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
          Catalog access is coming. Leave your email and we’ll keep the door
          marked.
        </p>
        <form className="form" onSubmit={onSubmit}>
          <label htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <label htmlFor={`${id}-password`}>Password</label>
          <input
            id={`${id}-password`}
            name="password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
          />
          <button className="btn btn--solid" type="submit">
            {title}
          </button>
        </form>
        {note ? (
          <p className="form-note" role="status">
            {note}
          </p>
        ) : null}
        <p className="dialog__switch">
          {mode === 'signup' ? (
            <button type="button" onClick={() => onSwitch('login')}>
              Have a seat already? Log in
            </button>
          ) : (
            <button type="button" onClick={() => onSwitch('signup')}>
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

export default App
