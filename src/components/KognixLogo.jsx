// Kognix SVG Logo — Navy rounded square + white K + orange dot
export default function KognixLogo({ size = 44, showText = true, textColor = '#1e3a6e', dark = false }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Icon mark */}
            <svg
                width={size} height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Rounded square background */}
                <rect width="100" height="100" rx="22" fill="#1e3a6e" />

                {/* White K — vertical stroke */}
                <rect x="28" y="24" width="13" height="52" rx="6.5" fill="white" />

                {/* White K — upper-right diagonal stroke */}
                <rect
                    x="38" y="22"
                    width="13" height="36"
                    rx="6.5"
                    fill="white"
                    transform="rotate(38 51 40)"
                />

                {/* White K — lower-right diagonal stroke */}
                <rect
                    x="38" y="50"
                    width="13" height="36"
                    rx="6.5"
                    fill="white"
                    transform="rotate(-38 51 60)"
                />

                {/* Orange dot above the K */}
                <circle cx="62" cy="22" r="10" fill="#f97316" />
            </svg>

            {/* Text */}
            {showText && (
                <div>
                    <div style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: '20px',
                        fontWeight: 700,
                        color: dark ? '#fff' : textColor,
                        lineHeight: 1.1,
                        letterSpacing: '-0.3px',
                    }}>
                        Kognix
                    </div>
                    <div style={{
                        fontSize: '9.5px',
                        fontWeight: 600,
                        color: '#f97316',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        lineHeight: 1.2,
                    }}>
                        Smart School Management
                    </div>
                </div>
            )}
        </div>
    )
}
