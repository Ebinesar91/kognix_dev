import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON) {
    console.warn(
        '[KogniX] Supabase env vars missing.\n' +
        'Check if .env.local exists in the project root and contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    )
} else {
    console.log('[KogniX] Supabase initialized with URL:', SUPABASE_URL)
    // Connectivity test
    fetch(SUPABASE_URL + '/auth/v1/health')
        .then(res => console.log('[KogniX] Connection Check:', res.ok ? 'Connected' : 'Error ' + res.status))
        .catch(err => console.error('[KogniX] Connection Check: FAILED TO FETCH. Check your network/firewall.', err))
}

export const supabase = createClient(
    SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_ANON || 'placeholder-anon-key',
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
        }
    }
)
