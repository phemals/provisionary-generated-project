import { useState, useEffect } from 'react';
import {
  startOfDay, endOfDay, startOfWeek, endOfWeek,
  addDays, subDays, addWeeks, subWeeks, format
} from 'date-fns';
import { useTeams } from '../hooks/useTeams';
import { useShifts } from '../hooks/useShifts';
import { ViewMode, DateRange } from '../types';
import Header from '../components/Header';
import ViewTabs from '../components/ViewTabs';
import DateNav from '../components/DateNav';
import ShiftGrid from '../components/ShiftGrid';
import ShiftList from '../components/ShiftList';
import DateRangePicker from '../components/DateRangePicker';
import StatsBar from '../components/StatsBar';

const TEAM_KEY = 'shifts_selected_team';

export default function Dashboard() {
  const { teams, loading: teamsLoading } = useTeams();
  const [selectedTeamId, setSelectedTeamId] = useState<string>(() =>
    localStorage.getItem(TEAM_KEY) ?? ''
  );
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');
  const [anchor, setAnchor] = useState<Date>(new Date());
  const [customRange, setCustomRange] = useState<DateRange>({
    start: startOfDay(new Date()),
    end: endOfDay(addDays(new Date(), 6)),
  });

  // Auto-select first team
  useEffect(() => {
    if (!selectedTeamId && teams.length > 0) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  const handleTeamChange = (id: string) => {
    setSelectedTeamId(id);
    localStorage.setItem(TEAM_KEY, id);
  };

  const dateRange: DateRange = (() => {
    if (viewMode === 'daily') {
      return { start: startOfDay(anchor), end: endOfDay(anchor) };
    }
    if (viewMode === 'weekly') {
      return {
        start: startOfWeek(anchor, { weekStartsOn: 1 }),
        end: endOfWeek(anchor, { weekStartsOn: 1 }),
      };
    }
    return customRange;
  })();

  const { shifts, scheduleEnabled, loading: shiftsLoading, error: shiftsError, refresh } =
    useShifts(selectedTeamId, dateRange.start, dateRange.end);

  const navigate = (dir: 'prev' | 'next') => {
    if (viewMode === 'daily') {
      setAnchor(d => dir === 'prev' ? subDays(d, 1) : addDays(d, 1));
    } else {
      setAnchor(d => dir === 'prev' ? subWeeks(d, 1) : addWeeks(d, 1));
    }
  };

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      <Header
        teams={teams}
        selectedTeamId={selectedTeamId}
        onTeamChange={handleTeamChange}
        teamsLoading={teamsLoading}
      />

      <main style={{ flex: 1, padding: '24px', maxWidth: 1400, margin: '0 auto', width: '100%' }}>
        {/* Page title */}
        <div className="fade-in" style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>
            {selectedTeam?.displayName ?? 'Select a Team'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Shift schedule — {format(dateRange.start, 'MMM d')}
            {viewMode !== 'daily' && ` – ${format(dateRange.end, 'MMM d, yyyy')}`}
            {viewMode === 'daily' && `, ${format(dateRange.start, 'yyyy')}`}
          </p>
        </div>

        {/* Controls row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <ViewTabs value={viewMode} onChange={setViewMode} />
          <div style={{ flex: 1 }} />
          {viewMode !== 'custom' && (
            <DateNav
              viewMode={viewMode}
              anchor={anchor}
              onNavigate={navigate}
              onToday={() => setAnchor(new Date())}
            />
          )}
          {viewMode === 'custom' && (
            <DateRangePicker value={customRange} onChange={setCustomRange} />
          )}
          <button className="btn btn-ghost" onClick={refresh} title="Refresh" style={{ padding: '8px 10px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M12 7A5 5 0 112 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 3v4h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        {!shiftsLoading && shifts.length > 0 && (
          <StatsBar shifts={shifts} dateRange={dateRange} />
        )}

        {/* Schedule disabled warning */}
        {!shiftsLoading && !scheduleEnabled && selectedTeamId && (
          <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--warning)' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1L15 14H1L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M8 6v4M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 13 }}>Scheduling is not enabled for this team.</span>
            </div>
          </div>
        )}

        {/* Main content */}
        {viewMode === 'weekly' || viewMode === 'custom' ? (
          <ShiftGrid
            shifts={shifts}
            dateRange={dateRange}
            loading={shiftsLoading}
            error={shiftsError}
          />
        ) : (
          <ShiftList
            shifts={shifts}
            date={dateRange.start}
            loading={shiftsLoading}
            error={shiftsError}
          />
        )}
      </main>
    </div>
  );
}
