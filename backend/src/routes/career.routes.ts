import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';

const router = Router();
const prisma = new PrismaClient();

// 3 & 4. POST /analyze-skills & GET recommendations
router.post('/career/analyze', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) return res.status(400).json({ error: 'userId is required' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        skills: { include: { skill: true } },
        interests: { include: { interest: true } }
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    // Call AI Service
    const recommendations = await AIService.analyzeProfile(user);

    // Save recommendations to DB
    const savedRecs = [];
    for (const rec of recommendations) {
      const saved = await prisma.recommendation.create({
        data: {
          userId,
          title: rec.title,
          description: rec.description,
          roadmap: JSON.stringify(rec.roadmap),
          skillGap: JSON.stringify(rec.skillGap)
        }
      });
      savedRecs.push({
          ...saved,
          roadmap: JSON.parse(saved.roadmap),
          skillGap: JSON.parse(saved.skillGap)
      });
    }

    res.json({ recommendations: savedRecs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// 5. GET /learning-roadmap
router.get('/career/roadmap/:recommendationId', async (req: Request, res: Response) => {
  try {
    const rec = await prisma.recommendation.findUnique({
      where: { id: req.params.recommendationId }
    });
    if (!rec) return res.status(404).json({ error: 'Not found' });
    
    res.json(JSON.parse(rec.roadmap));
  } catch(e) {
      res.status(500).json({ error: 'Failed' });
  }
});

export default router;
