import { useState } from 'react'
import { AuthProvider, useAuth } from './AuthContext'
import './App.css'
import Login from './components/Login'
import Register from './components/Register'
import ForgotPassword from './components/ForgotPassword'
import ParticleCanvas from './components/ParticleCanvas'
import RightPanel from './components/RightPanel'
import Toast from './components/Toast'
import Dashboard from './components/Dashboard'
import OTPVerify from './components/OTPVerify'

function PortalApp() {
  const { session, loading } = useAuth()
  const [page, setPage] = useState('login')
  const [animating, setAnimating] = useState(false)
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' })
  const [emailForVerification, setEmailForVerification] = useState('')

  function navigate(target) {
    if (target === page || animating) return
    setAnimating(true)
    setTimeout(() => {
      setPage(target)
      setAnimating(false)
    }, 350)
  }

  function showToast(msg, type = 'success') {
    setToast({ show: true, msg, type })
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500)
  }

  const pageForm = {
    login: <Login navigate={navigate} showToast={showToast} />,
    register: <Register navigate={navigate} showToast={showToast} setEmailForVerification={setEmailForVerification} />,
    forgot: <ForgotPassword navigate={navigate} showToast={showToast} />,
    otp: <OTPVerify navigate={navigate} showToast={showToast} email={emailForVerification} />,
  }

  // Loading state while Supabase resolves session
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', backgroundColor: '#fff' }}>
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #1e3a6e, #2d5299)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', animation: 'iconFloat 1.5s ease-in-out infinite',
          }}>🎓</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: 'Outfit,sans-serif', letterSpacing: '2px' }}>
            LOADING KOGNIX…
          </div>
        </div>
      </div>
    )
  }

  // Authenticated — show Dashboard
  if (session) {
    return (
      <>
        <Dashboard user={session.user} showToast={showToast} />
        <Toast toast={toast} />
      </>
    )
  }

  // Unauthenticated — show auth portal
  return (
    <div className="app-root">
      <ParticleCanvas />
      <div className="portal-shell">
        {/* Left panel */}
        <div className={`left-panel ${animating ? 'slide-out' : 'slide-in'}`}>
          {pageForm[page]}
        </div>
        {/* Right panel */}
        <RightPanel page={page} />
      </div>
      <Toast toast={toast} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <PortalApp />
    </AuthProvider>
  )
}
