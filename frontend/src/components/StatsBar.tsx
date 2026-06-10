import { Shift, DateRange } from '../types';
import { differenceInMinutes } from 'date-fns';

interface StatsBarProps {
  shifts: Shift[];
  dateRange: DateRange;
}

export default function StatsBar({ shifts }: StatsBarProps) {
  const assigned = shifts.filter(s => !s.isOpenShift);
  const open = shifts.filter(s => s.isOpenShift);
  const uniqueMembers = new Set(assigned.map(s => s.userId)).size;

  const totalMinutes = assigned.reduce((acc, s) => {
    const mins = differenceInMinutes(new Date(s.endDateTime), new Date(s.startDateTime));
    return acc + (mins > 0 ? mins : 0);
  }, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const stats = [
    { label: 'Total Shifts', value: assigned.length, color: 'var(--accent)' },
    { label: 'Open Shifts', value: open.length, color: 'var(--warning)' },
    { label: 'Team Members', value: uniqueMembers, color: 'var(--success)' },
    { label: 'Total Hours', value: totalHours, color: 'var(--info)' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 12,
      marginBottom: 20,
    }}>
      {stats.map(s => (
        <div key={s.label} className="card" style={{ padding: '14px 18px' }}>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
            {s.label}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  );
}
