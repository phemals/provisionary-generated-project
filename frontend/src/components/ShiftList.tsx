import { Shift } from '../types';
import { format, differenceInMinutes } from 'date-fns';
import ShiftCard from './ShiftCard';

interface ShiftListProps {
  shifts: Shift[];
  date: Date;
  loading: boolean;
  error: string | null;
}

export default function ShiftList({ shifts, date, loading, error }: ShiftListProps) {
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 12, color: 'var(--text-secondary)' }}>
        <span className="spinner" />
        <span>Loading shifts…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', padding: 20 }}>
        <span style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</span>
      </div>
    );
  }

  const assigned = shifts.filter(s => !s.isOpenShift);
  const open = shifts.filter(s => s.isOpenShift);

  if (shifts.length === 0) {
    return (
      <div className="card empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="rgba(99,102,241,0.1)" />
          <path d="M32 16h-4v-2a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h-4a2 2 0 00-2 2v18a2 2 0 002 2h16a2 2 0 002-2V18a2 2 0 00-2-2zm-10-2h4v2h-4v-2zm10 22H16V18h16v18z" fill="#6366f1" />
        </svg>
        <h3>No shifts on {format(date, 'EEEE, MMM d')}</h3>
        <p>There are no scheduled shifts for this day.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {format(date, 'EEEE, MMMM d')} · {assigned.length} shift{assigned.length !== 1 ? 's' : ''}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {assigned.map(shift => <ShiftCard key={shift.id} shift={shift} />)}
        {open.length > 0 && (
          <>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8, marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Open Shifts ({open.length})
            </div>
            {open.map(shift => <ShiftCard key={shift.id} shift={shift} isOpen />)}
          </>
        )}
      </div>
    </div>
  );
}
