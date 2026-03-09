export default function Toast({ toast }) {
    const icons = { success: '✓', error: '✕', info: 'ℹ' }
    return (
        <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`} role="alert" aria-live="polite">
            <span>{icons[toast.type]}</span>
            <span>{toast.msg}</span>
        </div>
    )
}
