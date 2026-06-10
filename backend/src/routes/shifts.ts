import { Router } from 'express';
import { getGraphClient } from '../graph/graphClient';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// In-memory display name cache
const nameCache = new Map<string, string>();

async function resolveDisplayName(userId: string): Promise<string> {
  if (nameCache.has(userId)) return nameCache.get(userId)!;
  try {
    const client = getGraphClient();
    const user: any = await client.api(`/users/${userId}?$select=displayName`).get();
    const name = user.displayName ?? userId;
    nameCache.set(userId, name);
    return name;
  } catch {
    return userId;
  }
}

router.get('/:teamId/shifts', authMiddleware, async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { start, end } = req.query as { start?: string; end?: string };

    if (!start || !end) {
      return res.status(400).json({ error: 'start and end query params are required' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 28) {
      return res.status(400).json({ error: 'Date range cannot exceed 28 days' });
    }

    const client = getGraphClient();

    // Check schedule is enabled
    let scheduleEnabled = true;
    try {
      const schedule: any = await client.api(`/teams/${teamId}/schedule`).get();
      scheduleEnabled = schedule.enabled ?? true;
    } catch {
      scheduleEnabled = false;
      return res.json({ shifts: [], scheduleEnabled: false });
    }

    const params = `$filter=sharedShift/startDateTime ge ${start} and sharedShift/endDateTime le ${end}`;

    // Fetch assigned shifts
    const assignedRaw: any[] = [];
    let assignedUrl = `/teams/${teamId}/schedule/shifts?${params}`;
    while (assignedUrl) {
      const page: any = await client.api(assignedUrl).get();
      assignedRaw.push(...(page.value ?? []));
      assignedUrl = page['@odata.nextLink'] ?? null;
    }

    // Fetch open shifts
    const openRaw: any[] = [];
    let openUrl = `/teams/${teamId}/schedule/openShifts?${params}`;
    try {
      while (openUrl) {
        const page: any = await client.api(openUrl).get();
        openRaw.push(...(page.value ?? []));
        openUrl = page['@odata.nextLink'] ?? null;
      }
    } catch {
      // open shifts may not be available
    }

    // Resolve display names in parallel
    const userIds = [...new Set(assignedRaw.map(s => s.userId).filter(Boolean))];
    await Promise.all(userIds.map(id => resolveDisplayName(id)));

    const shifts = [
      ...assignedRaw.map(s => ({
        id: s.id,
        userId: s.userId,
        displayName: nameCache.get(s.userId) ?? s.userId,
        startDateTime: s.sharedShift?.startDateTime ?? s.draftShift?.startDateTime,
        endDateTime: s.sharedShift?.endDateTime ?? s.draftShift?.endDateTime,
        theme: s.sharedShift?.theme ?? s.draftShift?.theme,
        label: s.sharedShift?.activities?.[0]?.displayName ?? null,
        notes: s.sharedShift?.notes ?? null,
        isOpenShift: false,
      })),
      ...openRaw.map(s => ({
        id: s.id,
        userId: '',
        displayName: 'Open Shift',
        startDateTime: s.sharedOpenShift?.startDateTime ?? s.draftOpenShift?.startDateTime,
        endDateTime: s.sharedOpenShift?.endDateTime ?? s.draftOpenShift?.endDateTime,
        theme: s.sharedOpenShift?.theme ?? s.draftOpenShift?.theme,
        label: s.sharedOpenShift?.activities?.[0]?.displayName ?? null,
        notes: null,
        isOpenShift: true,
      })),
    ];

    res.json({ shifts, scheduleEnabled });
  } catch (err: any) {
    if (err?.statusCode === 429) {
      const retryAfter = err.headers?.['retry-after'] ?? '10';
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({ error: 'Rate limited by Graph API', retryAfter });
    }
    next(err);
  }
});

export default router;
