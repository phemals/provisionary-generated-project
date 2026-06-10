export interface Team {
  id: string;
  displayName: string;
  description?: string;
}

export interface Shift {
  id: string;
  userId: string;
  displayName: string;
  startDateTime: string;
  endDateTime: string;
  theme?: string;
  label?: string;
  notes?: string;
  isOpenShift: boolean;
}

export interface ShiftsResponse {
  shifts: Shift[];
  scheduleEnabled: boolean;
}

export type ViewMode = 'daily' | 'weekly' | 'custom';

export interface DateRange {
  start: Date;
  end: Date;
}
