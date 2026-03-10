import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 1. POST /student-profile
router.post('/student-profile', async (req: Request, res: Response) => {
  try {
    const { name, email, academicBg, goals, skills, interests } = req.body;

    // Very basic validation
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Upsert User
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, academicBg, goals },
      create: { name, email, academicBg, goals },
    });

    // Handle Skills (simplified for MVP)
    if (skills && Array.isArray(skills)) {
      for (const skillName of skills) {
        const skill = await prisma.skill.upsert({
          where: { name: skillName.toLowerCase() },
          update: {},
          create: { name: skillName.toLowerCase() },
        });
        
        // Link to user
        await prisma.userSkill.upsert({
          where: { userId_skillId: { userId: user.id, skillId: skill.id } },
          update: {},
          create: { userId: user.id, skillId: skill.id }
        });
      }
    }

    // Handle Interests
    if (interests && Array.isArray(interests)) {
      for (const interestName of interests) {
        const interest = await prisma.interest.upsert({
          where: { name: interestName.toLowerCase() },
          update: {},
          create: { name: interestName.toLowerCase() },
        });
        
        await prisma.userInterest.upsert({
          where: { userId_interestId: { userId: user.id, interestId: interest.id } },
          update: {},
          create: { userId: user.id, interestId: interest.id }
        });
      }
    }

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error: any) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save student profile' });
  }
});

// 6. GET /student-history
router.get('/student-history/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const dbRecommendations = await prisma.recommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const recommendations = dbRecommendations.map((rec: any) => ({
        ...rec,
        roadmap: JSON.parse(rec.roadmap),
        skillGap: JSON.parse(rec.skillGap)
    }));

    const chats = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
            orderBy: { createdAt: 'asc'}
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ recommendations, chats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
