import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import KognixLogo from './KognixLogo'

export default function Dashboard({ user, showToast }) {
    const [signingOut, setSigningOut] = useState(false)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error) {
                    console.error('[KogniX] Error fetching profile:', error)
                } else {
                    setProfile(data)
                }
            } catch (err) {
                console.error('[KogniX] Unexpected error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user])

    async function handleSignOut() {
        setSigningOut(true)
        const { error } = await supabase.auth.signOut()
        if (error) {
            showToast('Error signing out: ' + error.message, 'error')
            setSigningOut(false)
        }
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
    const studentId = profile?.student_id || user?.user_metadata?.student_id || '—'
    const email = user?.email || '—'
    const avatar = displayName.charAt(0).toUpperCase()

    // Stats from profile or defaults
    const stats = [
        { label: 'Courses', value: profile?.courses_count || '0', icon: '📚' },
        { label: 'Assignments', value: profile?.assignments_count || '0', icon: '📝' },
        { label: 'GPA', value: profile?.gpa?.toFixed(1) || '0.0', icon: '⭐' },
    ]

    return (
        <div style={{
            minHeight: '100vh', width: '100vw',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Outfit', sans-serif",
            padding: '24px',
        }}>
            <div style={{
                background: '#fff',
                borderRadius: '28px',
                padding: '48px 52px',
                width: '100%',
                maxWidth: '520px',
                boxShadow: '0 20px 60px rgba(30,58,110,0.15), 0 0 0 1px rgba(30,58,110,0.08)',
                position: 'relative',
                zIndex: 10,
            }}>

                {/* Logo */}
                <div style={{ marginBottom: '32px' }}>
                    <KognixLogo size={44} />
                </div>

                {/* Welcome header */}
                <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '13px', color: '#f97316', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Welcome back 👋
                    </div>
                    <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '28px', fontWeight: 700, color: '#1e3a6e', margin: 0, lineHeight: 1.2 }}>
                        {displayName}
                    </h1>
                </div>

                {/* Avatar + info card */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    background: '#f5f7fb', border: '1px solid #e8ecf5',
                    borderRadius: '16px', padding: '18px 22px', marginBottom: '28px',
                }}>
                    <div style={{
                        width: '54px', height: '54px',
                        background: 'linear-gradient(135deg, #1e3a6e, #2d5299)',
                        borderRadius: '14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', fontWeight: 700, color: '#fff',
                        flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                        {avatar}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>University Email</div>
                        <div style={{ fontSize: '14.5px', fontWeight: 600, color: '#1e3a6e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>
                        {studentId !== '—' && (
                            <div style={{ fontSize: '12px', color: '#f97316', fontWeight: 600, marginTop: '3px' }}>
                                ID: {studentId}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px', marginBottom: '28px' }}>
                    {stats.map(stat => (
                        <div key={stat.label} style={{
                            background: '#f5f7fb', border: '1px solid #e8ecf5',
                            borderRadius: '14px', padding: '14px', textAlign: 'center',
                        }}>
                            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{stat.icon}</div>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e3a6e', fontFamily: "'Space Grotesk',sans-serif" }}>
                                {loading ? '...' : stat.value}
                            </div>
                            <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Status bar */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
                    borderRadius: '10px', padding: '10px 14px', marginBottom: '28px',
                    fontSize: '12.5px', color: '#059669',
                }}>
                    <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#10b981', boxShadow: '0 0 6px #10b981',
                        display: 'inline-block', flexShrink: 0,
                        animation: 'pulse 2s infinite',
                    }} />
                    {loading ? 'Synchronizing profile...' : 'Authenticated successfully · Session active'}
                </div>

                {/* Sign out button */}
                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    style={{
                        width: '100%', padding: '15px',
                        background: signingOut ? '#f5f7fb' : 'linear-gradient(135deg, #1e3a6e, #2d5299)',
                        border: signingOut ? '1.5px solid #e8ecf5' : 'none',
                        borderRadius: '14px',
                        fontFamily: "'Outfit', sans-serif", fontSize: '15px', fontWeight: 700,
                        color: signingOut ? '#888' : '#fff',
                        cursor: signingOut ? 'not-allowed' : 'pointer',
                        letterSpacing: '0.5px',
                        transition: 'all 0.25s ease',
                        boxShadow: signingOut ? 'none' : '0 6px 24px rgba(30,58,110,0.3)',
                    }}
                >
                    {signingOut ? 'Signing out…' : 'Sign Out'}
                </button>

            </div>
        </div>
    )
}

