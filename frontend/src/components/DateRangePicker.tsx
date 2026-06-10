import { format, differenceInDays } from 'date-fns';
import { DateRange } from '../types';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

export default function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const days = differenceInDays(value.end, value.start) + 1;
  const tooLong = days > 28;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>From</label>
      <input
        type="date"
        className="input"
        style={{ width: 140 }}
        value={format(value.start, 'yyyy-MM-dd')}
        onChange={e => {
          const d = new Date(e.target.value + 'T00:00:00');
          if (!isNaN(d.getTime())) onChange({ ...value, start: d });
        }}
      />
      <label style={{ fontSize: 12, color: 'var(--text-secondary)' }}>To</label>
      <input
        type="date"
        className="input"
        style={{ width: 140 }}
        value={format(value.end, 'yyyy-MM-dd')}
        onChange={e => {
          const d = new Date(e.target.value + 'T23:59:59');
          if (!isNaN(d.getTime())) onChange({ ...value, end: d });
        }}
      />
      {tooLong && (
        <span style={{ fontSize: 12, color: 'var(--danger)' }}>Max 28 days</span>
      )}
      {!tooLong && (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{days} day{days !== 1 ? 's' : ''}</span>
      )}
    </div>
  );
}
