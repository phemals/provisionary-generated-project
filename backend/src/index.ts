import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import teamsRouter from './routes/teams';
import shiftsRouter from './routes/shifts';

const app = express();
const port = parseInt(process.env.PORT || '5000');
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';

app.use(cors({
  origin: [frontendOrigin, 'http://localhost:8080'],
  credentials: true,
}));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/teams', teamsRouter);
app.use('/api/teams', shiftsRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend listening on http://0.0.0.0:${port}`);
});
