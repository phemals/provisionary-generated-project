import { useAuth } from '../auth/useAuth';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '20px',
    }}>
      <div className="card fade-in" style={{ maxWidth: 420, width: '100%', textAlign: 'center', padding: '48px 40px' }}>
        <div style={{ marginBottom: 24 }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ margin: '0 auto' }}>
            <rect width="56" height="56" rx="14" fill="#6366f1" fillOpacity="0.15" />
            <path d="M36 20h-4v-2a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h-4a2 2 0 00-2 2v14a2 2 0 002 2h16a2 2 0 002-2V22a2 2 0 00-2-2zm-10-2h4v2h-4v-2zm10 18H20V22h16v14z" fill="#6366f1" />
            <rect x="23" y="26" width="10" height="2" rx="1" fill="#6366f1" />
            <rect x="23" y="30" width="7" height="2" rx="1" fill="#6366f1" />
          </svg>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8 }}>Teams Shifts Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 14 }}>
          Sign in with your Microsoft 365 account to view shift schedules across all teams.
        </p>
        <button
          className="btn btn-primary"
          onClick={login}
          disabled={isLoading}
          style={{ width: '100%', justifyContent: 'center', padding: '12px 24px', fontSize: 14 }}
        >
          {isLoading ? (
            <><span className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="1" y="1" width="7" height="7" fill="#f25022" />
                <rect x="10" y="1" width="7" height="7" fill="#7fba00" />
                <rect x="1" y="10" width="7" height="7" fill="#00a4ef" />
                <rect x="10" y="10" width="7" height="7" fill="#ffb900" />
              </svg>
              Sign in with Microsoft
            </>
          )}
        </button>
        <p style={{ marginTop: 24, fontSize: 12, color: 'var(--text-secondary)' }}>
          Manager access required. Contact your IT admin if you need permissions.
        </p>
      </div>
    </div>
  );
}
