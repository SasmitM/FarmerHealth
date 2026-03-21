import './loadEnv';
import express from 'express';
import cors from 'cors';
import profileRouter from './routes/profile';
import symptomsRouter from './routes/symptoms';
import firstaidRouter from './routes/firstaid';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/profile', profileRouter);
app.use('/api/symptoms', symptomsRouter);
app.use('/api/firstaid', firstaidRouter);

app.listen(PORT, () => {
  console.log(`FarmerHealth API running at http://localhost:${PORT}`);
});
