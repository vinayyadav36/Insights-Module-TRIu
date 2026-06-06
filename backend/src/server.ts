import express from 'express';
import { ensureSeedData } from './seed/index.js';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

ensureSeedData().then(() => {
  app.listen(PORT, () => {
    // Server running
  });
});
