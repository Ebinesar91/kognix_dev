import KognixLogo from './KognixLogo'

// Inline student illustration SVG (reading/studying pose)
function StudentIllustration() {
    return (
        <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Book */}
            <rect x="60" y="155" width="140" height="80" rx="10" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            <line x1="130" y1="155" x2="130" y2="235" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <rect x="70" y="165" width="50" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="70" y="175" width="40" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="70" y="185" width="45" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="70" y="195" width="35" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
            <rect x="140" y="165" width="50" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
            <rect x="140" y="175" width="40" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="140" y="185" width="45" height="4" rx="2" fill="rgba(255,255,255,0.3)" />
            <rect x="140" y="195" width="35" height="4" rx="2" fill="rgba(255,255,255,0.25)" />
            {/* Body */}
            <ellipse cx="130" cy="130" rx="38" ry="42" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
            {/* Head */}
            <circle cx="130" cy="72" r="28" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
            {/* Hair */}
            <path d="M104 65 Q110 40 130 38 Q150 40 156 65 Q145 56 130 58 Q115 56 104 65Z" fill="rgba(255,255,255,0.35)" />
            {/* Face features */}
            <circle cx="121" cy="72" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="139" cy="72" r="3" fill="rgba(255,255,255,0.6)" />
            <path d="M123 82 Q130 87 137 82" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Arms */}
            <path d="M92 130 Q70 148 80 168" stroke="rgba(255,255,255,0.3)" strokeWidth="10" strokeLinecap="round" />
            <path d="M168 130 Q190 148 180 168" stroke="rgba(255,255,255,0.3)" strokeWidth="10" strokeLinecap="round" />
            {/* Orange dot accent */}
            <circle cx="185" cy="55" r="12" fill="#f97316" opacity="0.9" />
            <circle cx="190" cy="48" r="6" fill="#f97316" opacity="0.5" />
            {/* Stars */}
            <circle cx="55" cy="90" r="3" fill="rgba(255,255,255,0.6)" />
            <circle cx="205" cy="105" r="2" fill="rgba(255,255,255,0.5)" />
            <circle cx="72" cy="130" r="2" fill="rgba(255,255,255,0.4)" />
            <circle cx="215" cy="80" r="3" fill="rgba(255,255,255,0.4)" />
        </svg>
    )
}

const content = {
    login: {
        title: 'Welcome Back\nto Kognix',
        sub: 'Log in to access your courses, assignments, and academic progress.',
        dot: 0,
    },
    register: {
        title: 'Join the\nKognix Network',
        sub: 'Create your student account and start your smart learning journey today.',
        dot: 1,
    },
    forgot: {
        title: 'Secure Account\nRecovery',
        sub: "We'll guide you through resetting your password safely and quickly.",
        dot: 2,
    },
}

export default function RightPanel({ page }) {
    const c = content[page] || content.login

    return (
        <div className="right-panel">
            {/* Decorative blobs */}
            <div className="rp-blob" />
            <div className="rp-blob" />
            <div className="rp-blob" />

            {/* Spinning arc */}
            <div className="rp-arc" />

            {/* Logo top-left */}
            <div className="rp-logo">
                <KognixLogo size={36} dark showText={false} />
                <div className="rp-logo-text">Kognix</div>
            </div>

            {/* Illustration */}
            <div className="rp-illustration">
                <StudentIllustration />
            </div>

            {/* Text content */}
            <div className="rp-content">
                <div className="rp-title">{c.title}</div>
                <div className="rp-sub">{c.sub}</div>
            </div>

            {/* Dot indicators */}
            <div className="rp-dots">
                {['login', 'register', 'forgot'].map((p, i) => (
                    <div key={p} className={`rp-dot${i === c.dot ? ' active' : ''}`} />
                ))}
            </div>
        </div>
    )
}
