import { useState } from 'react'
import { supabase } from '../supabase'
import KognixLogo from './KognixLogo'

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }

function strengthScore(v) {
    let s = 0
    if (v.length >= 8) s++
    if (/[A-Z]/.test(v)) s++
    if (/[0-9]/.test(v)) s++
    if (/[^A-Za-z0-9]/.test(v)) s++
    return s
}

export default function Register({ navigate, showToast, setEmailForVerification }) {
    const [form, setForm] = useState({ name: '', studentId: '', email: '', pass: '', confirm: '' })
    const [showPass, setShowPass] = useState(false)
    const [showCon, setShowCon] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [agree, setAgree] = useState(false)

    const score = strengthScore(form.pass)
    const strengthClass = ['', 'weak', 'medium', 'medium', 'strong']
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']

    function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

    function validate() {
        const e = {}
        if (form.name.trim().length < 2) e.name = 'Enter your full name.'
        if (form.studentId.trim().length < 3) e.studentId = 'Enter a valid Student ID.'
        if (!isEmail(form.email)) e.email = 'Enter a valid email address.'
        if (form.pass.length < 8) e.pass = 'Password must be at least 8 characters.'
        if (form.pass !== form.confirm) e.confirm = 'Passwords do not match.'
        if (!agree) e.agree = 'Please accept the terms to continue.'
        setErrors(e)
        return !Object.keys(e).length
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        if (!validate()) return
        setLoading(true)
        console.log('[KogniX] Attempting sign-up for:', form.email)
        const { data, error } = await supabase.auth.signUp({
            email: form.email,
            password: form.pass,
            options: {
                data: {
                    full_name: form.name,
                    student_id: form.studentId,
                },
            },
        })
        setLoading(false)
        if (error) {
            console.error('[KogniX] Sign-up error:', error)
            showToast('✕ ' + error.message, 'error')
        } else {
            console.log('[KogniX] Sign-up success:', data)
            setEmailForVerification(form.email)
            showToast('📧 Account created! Check your email for OTP.', 'info')
            setForm({ name: '', studentId: '', email: '', pass: '', confirm: '' })
            setAgree(false)
            setTimeout(() => navigate('otp'), 1400)
        }
    }

    function cls(key) {
        if (errors[key]) return 'invalid'
        if (form[key]) return 'valid'
        return ''
    }

    return (
        <div className="form-area" style={{ overflowY: 'auto', maxHeight: '100%' }}>
            <div className="brand-badge">
                <div className="brand-badge-icon">
                    <KognixLogo size={46} showText={false} />
                </div>
                <div>
                    <div className="brand-badge-text">Kognix</div>
                    <div className="brand-badge-sub">Smart School Management</div>
                </div>
            </div>

            <h1>Sign Up</h1>
            <p className="subtitle">Create your student account and get started.</p>

            <form onSubmit={handleSubmit} noValidate>

                <div className="field-wrap">
                    <input type="text" placeholder="Full Name"
                        value={form.name} onChange={e => set('name', e.target.value)}
                        className={cls('name')} autoComplete="name" />
                    {errors.name && <div className="field-error show">{errors.name}</div>}
                </div>

                <div className="field-wrap">
                    <input type="text" placeholder="Student ID (e.g. KGX-2024-001)"
                        value={form.studentId} onChange={e => set('studentId', e.target.value)}
                        className={cls('studentId')} autoComplete="off" />
                    {errors.studentId && <div className="field-error show">{errors.studentId}</div>}
                </div>

                <div className="field-wrap">
                    <input type="email" placeholder="University Email"
                        value={form.email} onChange={e => set('email', e.target.value)}
                        className={cls('email')} autoComplete="email" />
                    {errors.email && <div className="field-error show">{errors.email}</div>}
                </div>

                <div className="field-wrap">
                    <input type={showPass ? 'text' : 'password'} placeholder="Create Password (min. 8 chars)"
                        value={form.pass} onChange={e => set('pass', e.target.value)}
                        className={cls('pass')} autoComplete="new-password" style={{ paddingRight: '48px' }} />
                    <button type="button" className="eye-btn" onClick={() => setShowPass(s => !s)}>
                        {showPass ? '🙈' : '👁️'}
                    </button>
                    {errors.pass && <div className="field-error show">{errors.pass}</div>}
                    {form.pass.length > 0 && (
                        <>
                            <div className="strength-bar">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`strength-seg${i <= score ? ' ' + strengthClass[score] : ''}`} />
                                ))}
                            </div>
                            <div className="strength-label">{strengthLabel[score]}</div>
                        </>
                    )}
                </div>

                <div className="field-wrap">
                    <input type={showCon ? 'text' : 'password'} placeholder="Confirm Password"
                        value={form.confirm} onChange={e => set('confirm', e.target.value)}
                        className={cls('confirm')} autoComplete="new-password" style={{ paddingRight: '48px' }} />
                    <button type="button" className="eye-btn" onClick={() => setShowCon(s => !s)}>
                        {showCon ? '🙈' : '👁️'}
                    </button>
                    {errors.confirm && <div className="field-error show">{errors.confirm}</div>}
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label className="custom-check">
                        <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
                        <span className="check-box"><span className="check-icon">✓</span></span>
                        <span style={{ fontSize: '13px', color: '#666' }}>
                            I agree to the{' '}
                            <a href="#" style={{ color: '#f97316' }} onClick={e => e.preventDefault()}>Terms of Service</a>
                            {' & '}
                            <a href="#" style={{ color: '#f97316' }} onClick={e => e.preventDefault()}>Privacy Policy</a>
                        </span>
                    </label>
                    {errors.agree && <div className="field-error show">{errors.agree}</div>}
                </div>

                <button type="submit" className={`btn-primary${loading ? ' loading' : ''}`}>
                    <span className="shine" />
                    {loading ? 'Creating account…' : 'Create Account'}
                </button>

                <p className="form-foot">
                    Already enrolled?{' '}
                    <button type="button" onClick={() => navigate('login')}>Sign In</button>
                </p>

                <div className="status-bar">
                    <span className="status-dot" />
                    <span>Secure registration · Powered by Supabase</span>
                </div>
            </form>
        </div>
    )
}
