import { useAuth } from '../auth/useAuth';
import { Team } from '../types';

interface HeaderProps {
  teams: Team[];
  selectedTeamId: string;
  onTeamChange: (teamId: string) => void;
  teamsLoading: boolean;
}

export default function Header({ teams, selectedTeamId, onTeamChange, teamsLoading }: HeaderProps) {
  const { account, logout } = useAuth();

  const initials = account?.name
    ? account.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header style={{
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="7" fill="#6366f1" fillOpacity="0.2" />
            <path d="M17 9h-2V8a1 1 0 00-1-1h-2a1 1 0 00-1 1v1H9a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V10a1 1 0 00-1-1zm-5-1h2v1h-2V8zm5 10H9v-8h8v8z" fill="#6366f1" />
            <rect x="11" y="12" width="4" height="1.5" rx="0.75" fill="#6366f1" />
            <rect x="11" y="14.5" width="3" height="1.5" rx="0.75" fill="#6366f1" />
          </svg>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Shifts Dashboard</span>
        </div>

        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

        {teamsLoading ? (
          <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading teams…</span>
        ) : (
          <select
            className="select"
            value={selectedTeamId}
            onChange={e => onTeamChange(e.target.value)}
            style={{ minWidth: 200, maxWidth: 340 }}
          >
            {teams.length === 0 && <option value="">No teams found</option>}
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.displayName}</option>
            ))}
          </select>
        )}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.2 }}>{account?.name ?? 'Manager'}</span>
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.2 }}>{account?.username ?? ''}</span>
          </div>
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{ padding: '6px 12px', fontSize: 12 }}>
          Sign out
        </button>
      </div>
    </header>
  );
}
