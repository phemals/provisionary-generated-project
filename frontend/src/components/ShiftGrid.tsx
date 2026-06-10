import { useMemo } from 'react';
import { eachDayOfInterval, format, isSameDay, differenceInMinutes, isToday } from 'date-fns';
import { Shift, DateRange } from '../types';

interface ShiftGridProps {
  shifts: Shift[];
  dateRange: DateRange;
  loading: boolean;
  error: string | null;
}

const THEME_COLORS: Record<string, string> = {
  blue: '#3b82f6', green: '#22c55e', purple: '#a855f7',
  pink: '#ec4899', yellow: '#eab308', orange: '#f97316',
  teal: '#14b8a6', red: '#ef4444', gray: '#6b7280',
};

export default function ShiftGrid({ shifts, dateRange, loading, error }: ShiftGridProps) {
  const days = useMemo(
    () => eachDayOfInterval({ start: dateRange.start, end: dateRange.end }),
    [dateRange]
  );

  const members = useMemo(() => {
    const map = new Map<string, string>();
    shifts.filter(s => !s.isOpenShift).forEach(s => {
      if (!map.has(s.userId)) map.set(s.userId, s.displayName || s.userId);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [shifts]);

  const openShifts = shifts.filter(s => s.isOpenShift);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80, gap: 12, color: 'var(--text-secondary)' }}>
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

  if (shifts.length === 0) {
    return (
      <div className="card empty-state">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="rgba(99,102,241,0.1)" />
          <path d="M32 16h-4v-2a2 2 0 00-2-2h-4a2 2 0 00-2 2v2h-4a2 2 0 00-2 2v18a2 2 0 002 2h16a2 2 0 002-2V18a2 2 0 00-2-2zm-10-2h4v2h-4v-2zm10 22H16V18h16v18z" fill="#6366f1" />
        </svg>
        <h3>No shifts this period</h3>
        <p>There are no scheduled shifts for the selected date range.</p>
      </div>
    );
  }

  const COL_W = Math.max(120, Math.floor(900 / days.length));

  return (
    <div className="fade-in" style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--border)' }}>
      <table style={{ borderCollapse: 'collapse', width: '100%', minWidth: days.length * COL_W + 180 }}>
        <thead>
          <tr style={{ background: 'var(--bg-secondary)' }}>
            <th style={{
              padding: '10px 16px', textAlign: 'left', fontSize: 11,
              color: 'var(--text-secondary)', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              borderBottom: '1px solid var(--border)',
              position: 'sticky', left: 0, background: 'var(--bg-secondary)', zIndex: 2,
              minWidth: 160,
            }}>
              Team Member
            </th>
            {days.map(day => (
              <th key={day.toISOString()} style={{
                padding: '10px 8px', textAlign: 'center', fontSize: 12,
                color: isToday(day) ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: isToday(day) ? 700 : 500,
                borderBottom: '1px solid var(--border)',
                borderLeft: '1px solid var(--border)',
                minWidth: COL_W,
                background: isToday(day) ? 'rgba(99,102,241,0.06)' : 'transparent',
              }}>
                <div>{format(day, 'EEE')}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isToday(day) ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {format(day, 'd')}
                </div>
                <div style={{ fontSize: 10 }}>{format(day, 'MMM')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((member, ri) => (
            <tr key={member.id} style={{ background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              <td style={{
                padding: '10px 16px', fontSize: 13, fontWeight: 500,
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky', left: 0,
                background: ri % 2 === 0 ? 'var(--bg-primary)' : 'rgba(255,255,255,0.02)',
                zIndex: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>
                    {member.name}
                  </span>
                </div>
              </td>
              {days.map(day => {
                const dayShifts = shifts.filter(
                  s => !s.isOpenShift && s.userId === member.id && isSameDay(new Date(s.startDateTime), day)
                );
                return (
                  <td key={day.toISOString()} style={{
                    padding: '6px 6px', verticalAlign: 'top',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: '1px solid var(--border)',
                    background: isToday(day) ? 'rgba(99,102,241,0.04)' : 'transparent',
                  }}>
                    {dayShifts.map(s => {
                      const color = THEME_COLORS[s.theme ?? ''] ?? 'var(--accent)';
                      const mins = differenceInMinutes(new Date(s.endDateTime), new Date(s.startDateTime));
                      return (
                        <div key={s.id} style={{
                          background: color + '18',
                          border: `1px solid ${color}44`,
                          borderLeft: `3px solid ${color}`,
                          borderRadius: 6,
                          padding: '4px 6px',
                          marginBottom: 3,
                          fontSize: 11,
                          color: 'var(--text-primary)',
                        }}>
                          <div style={{ fontWeight: 600 }}>
                            {format(new Date(s.startDateTime), 'h:mma')}–{format(new Date(s.endDateTime), 'h:mma')}
                          </div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                            {(mins / 60).toFixed(1)}h{s.label ? ` · ${s.label}` : ''}
                          </div>
                        </div>
                      );
                    })}
                    {dayShifts.length === 0 && (
                      <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--border)', fontSize: 16 }}>–</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Open shifts row */}
          {openShifts.length > 0 && (
            <tr>
              <td style={{
                padding: '10px 16px', fontSize: 13, fontWeight: 500,
                color: 'var(--warning)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky', left: 0,
                background: 'var(--bg-primary)', zIndex: 1,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'rgba(245,158,11,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0,
                  }}>?</div>
                  Open Shifts
                </div>
              </td>
              {days.map(day => {
                const dayOpen = openShifts.filter(s => isSameDay(new Date(s.startDateTime), day));
                return (
                  <td key={day.toISOString()} style={{
                    padding: '6px 6px', verticalAlign: 'top',
                    borderBottom: '1px solid var(--border)',
                    borderLeft: '1px solid var(--border)',
                    background: isToday(day) ? 'rgba(99,102,241,0.04)' : 'transparent',
                  }}>
                    {dayOpen.map(s => (
                      <div key={s.id} style={{
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.3)',
                        borderLeft: '3px solid var(--warning)',
                        borderRadius: 6,
                        padding: '4px 6px',
                        marginBottom: 3,
                        fontSize: 11,
                        color: 'var(--text-primary)',
                      }}>
                        <div style={{ fontWeight: 600 }}>
                          {format(new Date(s.startDateTime), 'h:mma')}–{format(new Date(s.endDateTime), 'h:mma')}
                        </div>
                        <div style={{ color: 'var(--warning)', fontSize: 10 }}>Open</div>
                      </div>
                    ))}
                    {dayOpen.length === 0 && (
                      <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'var(--border)', fontSize: 16 }}>–</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
