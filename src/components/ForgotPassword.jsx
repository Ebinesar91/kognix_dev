import { useState } from 'react'
import { supabase } from '../supabase'
import KognixLogo from './KognixLogo'

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

export default function ForgotPassword({ navigate, showToast }) {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [newPass, setNewPass] = useState('')
    const [confirmP, setConfirmP] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showCon, setShowCon] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)

    /* ── Step 1: Send password reset email ── */
    async function handleSendReset(ev) {
        ev.preventDefault()
        if (!isEmail(email)) { setErrors({ email: 'Enter a valid email address.' }); return }
        setErrors({})
        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/?reset=true`,
        })
        setLoading(false)
        if (error) {
            showToast('✕ ' + error.message, 'error')
        } else {
            showToast('📧 Password reset email sent! Check your inbox.', 'info')
            setStep(2)
            startResend()
        }
    }

    function startResend() {
        setResendTimer(30)
        const iv = setInterval(() => {
            setResendTimer(t => { if (t <= 1) { clearInterval(iv); return 0 } return t - 1 })
        }, 1000)
    }

    async function handleResend() {
        if (resendTimer > 0) return
        setLoading(true)
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/?reset=true`,
        })
        setLoading(false)
        if (error) showToast('✕ ' + error.message, 'error')
        else { showToast('📧 Email resent!', 'info'); startResend() }
    }

    /* ── OTP input helpers ── */
    function handleOtpChange(i, val) {
        if (!/^\d?$/.test(val)) return
        const next = [...otp]; next[i] = val; setOtp(next)
        if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus()
    }
    function handleOtpKey(i, e) {
        if (e.key === 'Backspace' && !otp[i] && i > 0) document.getElementById(`otp-${i - 1}`)?.focus()
    }

    /* ── Step 2: Verify OTP via Supabase (email OTP flow) ── */
    async function handleVerifyOtp(ev) {
        ev.preventDefault()
        const code = otp.join('')
        if (code.length < 6) { setErrors({ otp: 'Enter the 6-digit code.' }); return }
        setErrors({})
        setLoading(true)
        const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'recovery' })
        setLoading(false)
        if (error) {
            showToast('✕ ' + error.message, 'error')
        } else {
            showToast('✓ OTP verified!', 'success')
            setStep(3)
        }
    }

    /* ── Step 3: Set new password ── */
    async function handleReset(ev) {
        ev.preventDefault()
        const e = {}
        if (newPass.length < 8) e.newPass = 'Password must be at least 8 characters.'
        if (newPass !== confirmP) e.confirmP = 'Passwords do not match.'
        setErrors(e)
        if (Object.keys(e).length) return
        setLoading(true)
        const { error } = await supabase.auth.updateUser({ password: newPass })
        setLoading(false)
        if (error) {
            showToast('✕ ' + error.message, 'error')
        } else {
            showToast('🔐 Password updated! Please sign in.', 'success')
            await supabase.auth.signOut()
            setTimeout(() => navigate('login'), 1000)
        }
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

            {/* Step progress bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {[1, 2, 3].map(s => (
                    <div key={s} style={{
                        flex: 1, height: '4px', borderRadius: '2px',
                        background: s <= step ? '#1e3a6e' : '#e8e8f0',
                        transition: 'background 0.4s ease',
                    }} />
                ))}
            </div>

            {/* STEP 1 — Email */}
            {step === 1 && <>
                <h1>Forgot Password?</h1>
                <p className="subtitle">Enter your email and we'll send a recovery link.</p>
                <form onSubmit={handleSendReset} noValidate>
                    <div className="field-wrap">
                        <input type="email" placeholder="Your registered email"
                            value={email} onChange={e => setEmail(e.target.value)}
                            className={errors.email ? 'invalid' : email ? 'valid' : ''}
                            autoComplete="email" />
                        {errors.email && <div className="field-error show">{errors.email}</div>}
                    </div>
                    <button type="submit" className={`btn-primary${loading ? ' loading' : ''}`}>
                        <span className="shine" />
                        {loading ? 'Sending…' : 'Send Reset Link'}
                    </button>
                    <p className="form-foot">
                        Remember it? <button type="button" onClick={() => navigate('login')}>Back to Login</button>
                    </p>
                </form>
            </>}

            {/* STEP 2 — OTP code */}
            {step === 2 && <>
                <h1>Check Your Email</h1>
                <p className="subtitle">
                    Enter the 6-digit code sent to{' '}
                    <strong style={{ color: '#1e3a6e' }}>{email}</strong>
                </p>
                <form onSubmit={handleVerifyOtp} noValidate>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', justifyContent: 'center' }}>
                        {otp.map((d, i) => (
                            <input key={i} id={`otp-${i}`}
                                type="text" inputMode="numeric" maxLength={1}
                                value={d}
                                onChange={e => handleOtpChange(i, e.target.value)}
                                onKeyDown={e => handleOtpKey(i, e)}
                                style={{
                                    width: '46px', height: '52px',
                                    border: `2px solid ${d ? '#1e3a6e' : '#e8e8f0'}`,
                                    borderRadius: '12px', background: '#f5f5fb',
                                    textAlign: 'center', fontSize: '20px', fontWeight: '700',
                                    color: '#1e3a6e', outline: 'none',
                                    fontFamily: "'Outfit', sans-serif",
                                    transition: 'all 0.25s',
                                    boxShadow: d ? '0 0 0 4px rgba(30,58,110,0.1)' : 'none',
                                }}
                            />
                        ))}
                    </div>
                    {errors.otp && <div className="field-error show" style={{ textAlign: 'center' }}>{errors.otp}</div>}
                    <button type="submit" className={`btn-primary${loading ? ' loading' : ''}`} style={{ marginTop: '8px' }}>
                        <span className="shine" />
                        {loading ? 'Verifying…' : 'Verify Code'}
                    </button>
                    <p className="form-foot">
                        Didn't receive it?{' '}
                        <button type="button" onClick={handleResend}
                            style={{ color: resendTimer > 0 ? '#bbb' : '#f97316', cursor: resendTimer > 0 ? 'default' : 'pointer' }}>
                            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Email'}
                        </button>
                    </p>
                    <p className="form-foot" style={{ marginTop: '8px' }}>
                        <button type="button" onClick={() => setStep(1)}>← Change email</button>
                    </p>
                </form>
            </>}

            {/* STEP 3 — New password */}
            {step === 3 && <>
                <h1>Set New Password</h1>
                <p className="subtitle">Create a new secure password for your Kognix account.</p>
                <form onSubmit={handleReset} noValidate>
                    <div className="field-wrap">
                        <input type={showNew ? 'text' : 'password'} placeholder="New password (min. 8 characters)"
                            value={newPass} onChange={e => setNewPass(e.target.value)}
                            className={errors.newPass ? 'invalid' : newPass.length >= 8 ? 'valid' : ''}
                            autoComplete="new-password" style={{ paddingRight: '48px' }} />
                        <button type="button" className="eye-btn" onClick={() => setShowNew(s => !s)}>
                            {showNew ? '🙈' : '👁️'}
                        </button>
                        {errors.newPass && <div className="field-error show">{errors.newPass}</div>}
                    </div>
                    <div className="field-wrap">
                        <input type={showCon ? 'text' : 'password'} placeholder="Confirm new password"
                            value={confirmP} onChange={e => setConfirmP(e.target.value)}
                            className={errors.confirmP ? 'invalid' : (confirmP && confirmP === newPass) ? 'valid' : ''}
                            autoComplete="new-password" style={{ paddingRight: '48px' }} />
                        <button type="button" className="eye-btn" onClick={() => setShowCon(s => !s)}>
                            {showCon ? '🙈' : '👁️'}
                        </button>
                        {errors.confirmP && <div className="field-error show">{errors.confirmP}</div>}
                    </div>
                    <button type="submit" className={`btn-primary${loading ? ' loading' : ''}`}>
                        <span className="shine" />
                        {loading ? 'Updating…' : 'Update Password'}
                    </button>
                    <p className="form-foot">
                        <button type="button" onClick={() => navigate('login')}>← Back to Login</button>
                    </p>
                </form>
            </>}

            <div className="status-bar">
                <span className="status-dot" />
                <span>Secure recovery · SSL protected · Supabase Auth</span>
            </div>
        </div>
    )
}
