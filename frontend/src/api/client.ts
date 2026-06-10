import axios from 'axios';
import { Team, ShiftsResponse } from '../types';

const api = axios.create({ baseURL: '/api' });

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

api.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ── Mock data for in-browser preview ──────────────────────────────────────────
const MOCK_TEAMS: Team[] = [
  { id: 'team-1', displayName: 'Engineering', description: 'Software engineering team' },
  { id: 'team-2', displayName: 'Customer Support', description: 'Support team' },
  { id: 'team-3', displayName: 'Operations', description: 'Ops team' },
];

function makeMockShifts(teamId: string): ShiftsResponse {
  const members = [
    { id: 'u1', name: 'Alice Johnson' },
    { id: 'u2', name: 'Bob Smith' },
    { id: 'u3', name: 'Carol White' },
    { id: 'u4', name: 'David Lee' },
  ];
  const themes = ['blue', 'green', 'purple', 'teal', 'orange'];
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const shifts = [];
  let idCounter = 1;

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + dayOffset);
    if (day.getDay() === 0 || day.getDay() === 6) continue; // skip weekends

    for (const member of members) {
      if (Math.random() < 0.15) continue; // ~15% chance of day off
      const startHour = 8 + Math.floor(Math.random() * 2);
      const endHour = startHour + 7 + Math.floor(Math.random() * 2);
      const start = new Date(day);
      start.setHours(startHour, 0, 0, 0);
      const end = new Date(day);
      end.setHours(endHour, 0, 0, 0);

      shifts.push({
        id: `shift-${teamId}-${idCounter++}`,
        userId: member.id,
        displayName: member.name,
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        theme: themes[idCounter % themes.length],
        label: null,
        notes: null,
        isOpenShift: false,
      });
    }
  }

  // Add 2 open shifts mid-week
  const wed = new Date(monday);
  wed.setDate(monday.getDate() + 2);
  for (let i = 0; i < 2; i++) {
    const start = new Date(wed);
    start.setHours(9 + i * 4, 0, 0, 0);
    const end = new Date(wed);
    end.setHours(17 + i * 4, 0, 0, 0);
    shifts.push({
      id: `open-${teamId}-${i}`,
      userId: '',
      displayName: 'Open Shift',
      startDateTime: start.toISOString(),
      endDateTime: end.toISOString(),
      theme: 'yellow',
      label: null,
      notes: null,
      isOpenShift: true,
    });
  }

  return { shifts, scheduleEnabled: true };
}

const mockShiftCache = new Map<string, ShiftsResponse>();

// ── API functions ──────────────────────────────────────────────────────────────
export async function fetchTeams(): Promise<Team[]> {
  try {
    const { data } = await api.get<Team[]>('/teams');
    return data ?? [];
  } catch {
    // Fall back to mock data when backend is unavailable
    console.info('[Teams] Backend unavailable — using mock data');
    return MOCK_TEAMS;
  }
}

export async function fetchShifts(
  teamId: string,
  start: string,
  end: string
): Promise<ShiftsResponse> {
  try {
    const { data } = await api.get<ShiftsResponse>(`/teams/${teamId}/shifts`, {
      params: { start, end },
    });
    return data;
  } catch {
    // Fall back to mock data when backend is unavailable
    console.info('[Shifts] Backend unavailable — using mock data');
    if (!mockShiftCache.has(teamId)) {
      mockShiftCache.set(teamId, makeMockShifts(teamId));
    }
    return mockShiftCache.get(teamId)!;
  }
}
