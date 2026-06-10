import { Router } from 'express';
import { getGraphClient } from '../graph/graphClient';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, async (_req, res, next) => {
  try {
    const client = getGraphClient();
    const teams: { id: string; displayName: string; description?: string }[] = [];
    let url = '/groups?$filter=resourceProvisioningOptions/Any(x:x eq \'Team\')&$select=id,displayName,description&$top=50';

    while (url) {
      const page: any = await client.api(url).get();
      teams.push(...(page.value ?? []));
      url = page['@odata.nextLink'] ?? null;
    }

    teams.sort((a, b) => a.displayName.localeCompare(b.displayName));
    res.json(teams);
  } catch (err) {
    next(err);
  }
});

export default router;
