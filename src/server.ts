import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { getTasksByStatus, getAvailableStatuses } from './db';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/statuses', async (req, res) => {
  try {
    const statuses = await getAvailableStatuses();
    return res.json(statuses);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || e });
  }
});

app.get('/api/tasks', async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;

  if (!status) return res.status(400).json({ error: 'Missing status parameter' });

  try {
    const rows = await getTasksByStatus(status);
    return res.json(rows);
  } catch (e: any) {
    return res.status(500).json({ error: e.message || e });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
