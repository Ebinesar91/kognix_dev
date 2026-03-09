import { useState } from 'react'
import { supabase } from '../supabase'
import KognixLogo from './KognixLogo'

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

export default function Login({ navigate, showToast }) {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [remember, setRemember] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const e = {}
        if (!isEmail(email)) e.email = 'Enter a valid email address.'
        if (!pass) e.pass = 'Password is required.'
        setErrors(e)
        return !Object.keys(e).length
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        if (!validate()) return
        setLoading(true)
        console.log('[KogniX] Attempting login for:', email)
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
        setLoading(false)
        if (error) {
            console.error('[KogniX] Login error:', error)
            showToast('✕ ' + error.message, 'error')
        } else {
            console.log('[KogniX] Login success:', data)
            showToast('✓ Signed in successfully!', 'success')
            // AuthContext picks up session automatically
        }
    }

    async function handleGoogleLogin() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin },
        })
        if (error) showToast('✕ ' + error.message, 'error')
    }

    async function handleMicrosoftLogin() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: { redirectTo: window.location.origin },
        })
        if (error) showToast('✕ ' + error.message, 'error')
    }

    return (
        <div className="form-area">
            <div className="brand-badge">
                <div className="brand-badge-icon">
                    <KognixLogo size={46} showText={false} />
                </div>
                <div>
                    <div className="brand-badge-text">Kognix</div>
                    <div className="brand-badge-sub">Smart School Management</div>
                </div>
            </div>

            <h1>Login</h1>
            <p className="subtitle">Welcome back! Sign in to your student portal.</p>

            <form onSubmit={handleSubmit} noValidate>
                <div className="field-wrap">
                    <input
                        type="email" placeholder="Email Address"
                        value={email} onChange={e => setEmail(e.target.value)}
                        className={errors.email ? 'invalid' : email ? 'valid' : ''}
                        autoComplete="email"
                    />
                    {errors.email && <div className="field-error show">{errors.email}</div>}
                </div>

                <div className="field-wrap">
                    <input
                        type={showPass ? 'text' : 'password'} placeholder="Password"
                        value={pass} onChange={e => setPass(e.target.value)}
                        className={errors.pass ? 'invalid' : pass ? 'valid' : ''}
                        autoComplete="current-password" style={{ paddingRight: '48px' }}
                    />
                    <button type="button" className="eye-btn" onClick={() => setShowPass(s => !s)}>
                        {showPass ? '🙈' : '👁️'}
                    </button>
                    {errors.pass && <div className="field-error show">{errors.pass}</div>}
                </div>

                <div className="check-row">
                    <label className="custom-check">
                        <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                        <span className="check-box"><span className="check-icon">✓</span></span>
                        Remember me
                    </label>
                    <a href="#" className="forgot-link" onClick={e => { e.preventDefault(); navigate('forgot') }}>
                        Forgot Password?
                    </a>
                </div>

                <button type="submit" className={`btn-primary${loading ? ' loading' : ''}`}>
                    <span className="shine" />
                    {loading ? 'Signing in…' : 'Login'}
                </button>

                <div className="divider"><span>or sign in with</span></div>

                <div className="social-row">
                    <button type="button" className="social-btn" onClick={handleGoogleLogin}>
                        <svg viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57C21.36 18.45 22.56 15.57 22.56 12.25z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Google
                    </button>
                    <button type="button" className="social-btn" onClick={handleMicrosoftLogin}>
                        <svg viewBox="0 0 24 24"><rect x="1" y="1" width="10" height="10" fill="#f25022" /><rect x="13" y="1" width="10" height="10" fill="#7fba00" /><rect x="1" y="13" width="10" height="10" fill="#00a4ef" /><rect x="13" y="13" width="10" height="10" fill="#ffb900" /></svg>
                        Microsoft
                    </button>
                </div>

                <p className="form-foot">
                    Don't have an account?{' '}
                    <button type="button" onClick={() => navigate('register')}>Sign Up</button>
                </p>

                <div className="status-bar">
                    <span className="status-dot" />
                    <span>Secure connection · Powered by Supabase</span>
                </div>
            </form>
        </div>
    )
}
