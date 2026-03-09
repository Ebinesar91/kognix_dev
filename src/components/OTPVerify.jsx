import { useState } from 'react'
import { supabase } from '../supabase'
import KognixLogo from './KognixLogo'

export default function OTPVerify({ navigate, showToast, email }) {
    const [otp, setOtp] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleVerify(ev) {
        ev.preventDefault()
        if (otp.length < 6) return showToast('Enter the 6-digit code.', 'error')

        setLoading(true)
        console.log('[KogniX] Verifying OTP for:', email)
        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otp,
            type: 'signup'
        })
        setLoading(false)

        if (error) {
            console.error('[KogniX] OTP error:', error)
            showToast('✕ ' + error.message, 'error')
        } else {
            console.log('[KogniX] OTP success')
            showToast('✓ Email confirmed! You can now login.', 'success')
            navigate('login')
        }
    }

    return (
        <div className="form-area">
            <div className="brand-badge" style={{ marginBottom: '24px' }}>
                <div className="brand-badge-icon">
                    <KognixLogo size={46} showText={false} />
                </div>
                <div>
                    <div className="brand-badge-text">Kognix</div>
                    <div className="brand-badge-sub">Verify Account</div>
                </div>
            </div>

            <h1>Check Email</h1>
            <p className="subtitle">Enter the 6-digit code sent to<br /><b>{email || 'your email'}</b>.</p>

            <form onSubmit={handleVerify}>
                <div className="field-wrap">
                    <input
                        type="text" placeholder="······"
                        value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px', fontWeight: 700 }}
                        maxLength={6}
                        autoFocus
                    />
                </div>

                <button type="submit" className={`btn-primary${loading ? ' loading' : ''}`} style={{ marginTop: '12px' }}>
                    <span className="shine" />
                    {loading ? 'Verifying…' : 'Verify & Continue'}
                </button>

                <p className="form-foot">
                    Didn't get a code?{' '}
                    <button type="button" onClick={() => navigate('register')}>Try Again</button>
                </p>

                <div className="status-bar">
                    <span className="status-dot" />
                    <span>Secure Verification · Powered by Supabase</span>
                </div>
            </form>
        </div>
    )
}
