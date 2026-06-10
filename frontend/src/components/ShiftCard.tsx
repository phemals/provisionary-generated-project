import { Shift } from '../types';
import { format, differenceInMinutes } from 'date-fns';

interface ShiftCardProps {
  shift: Shift;
  isOpen?: boolean;
}

const THEME_COLORS: Record<string, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#a855f7',
  pink: '#ec4899',
  yellow: '#eab308',
  orange: '#f97316',
  teal: '#14b8a6',
  red: '#ef4444',
  gray: '#6b7280',
};

export default function ShiftCard({ shift, isOpen }: ShiftCardProps) {
  const start = new Date(shift.startDateTime);
  const end = new Date(shift.endDateTime);
  const mins = differenceInMinutes(end, start);
  const hours = (mins / 60).toFixed(1);
  const color = THEME_COLORS[shift.theme ?? ''] ?? (isOpen ? 'var(--warning)' : 'var(--accent)');

  return (
    <div className="card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '14px 18px',
      borderLeft: `3px solid ${color}`,
      transition: 'transform 0.15s, box-shadow 0.15s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: color + '22',
        border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color, flexShrink: 0,
      }}>
        {isOpen ? '?' : (shift.displayName?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?')}
      </div>

      {/* Name + label */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', marginBottom: 2 }}>
          {isOpen ? 'Open Shift' : (shift.displayName || 'Unknown')}
        </div>
        {shift.label && (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{shift.label}</div>
        )}
      </div>

      {/* Time */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
          {format(start, 'h:mm a')} – {format(end, 'h:mm a')}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{hours} hrs</div>
      </div>

      {/* Badge */}
      {isOpen && (
        <span className="badge badge-amber" style={{ flexShrink: 0 }}>Open</span>
      )}
    </div>
  );
}
