import { format, startOfWeek, endOfWeek } from 'date-fns';
import { ViewMode } from '../types';

interface DateNavProps {
  viewMode: ViewMode;
  anchor: Date;
  onNavigate: (dir: 'prev' | 'next') => void;
  onToday: () => void;
}

export default function DateNav({ viewMode, anchor, onNavigate, onToday }: DateNavProps) {
  const label = viewMode === 'daily'
    ? format(anchor, 'EEEE, MMM d, yyyy')
    : `${format(startOfWeek(anchor, { weekStartsOn: 1 }), 'MMM d')} – ${format(endOfWeek(anchor, { weekStartsOn: 1 }), 'MMM d, yyyy')}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <button className="btn btn-ghost" onClick={() => onNavigate('prev')} style={{ padding: '6px 10px' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span style={{
        fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
        minWidth: 200, textAlign: 'center',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        padding: '6px 12px',
      }}>
        {label}
      </span>
      <button className="btn btn-ghost" onClick={() => onNavigate('next')} style={{ padding: '6px 10px' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button className="btn btn-ghost" onClick={onToday} style={{ fontSize: 12, padding: '6px 12px' }}>
        Today
      </button>
    </div>
  );
}
