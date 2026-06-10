import { ViewMode } from '../types';

interface ViewTabsProps {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

const TABS: { label: string; value: ViewMode }[] = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Custom', value: 'custom' },
];

export default function ViewTabs({ value, onChange }: ViewTabsProps) {
  return (
    <div style={{
      display: 'flex',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: 3,
      gap: 2,
    }}>
      {TABS.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{
            padding: '5px 14px',
            borderRadius: 6,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            transition: 'all 0.15s',
            background: value === tab.value ? 'var(--accent)' : 'transparent',
            color: value === tab.value ? '#fff' : 'var(--text-secondary)',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
