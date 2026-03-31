import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
// We will separate these into routes/ later, for now a health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Import route modules (will be created in next steps)
import studentRoutes from './routes/student.routes';
import careerRoutes from './routes/career.routes';
import chatRoutes from './routes/chat.routes';

app.use('/api', studentRoutes);
app.use('/api', careerRoutes);
app.use('/api', chatRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
});
