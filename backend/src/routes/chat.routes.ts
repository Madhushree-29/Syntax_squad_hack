import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AIService } from '../services/ai.service';

const router = Router();
const prisma = new PrismaClient();

// 2. POST /ask-career-question
router.post('/chat', async (req: Request, res: Response) => {
    try {
        const { userId, message, chatSessionId } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
              skills: { include: { skill: true } },
              interests: { include: { interest: true } }
            }
        });
        
        if (!user) return res.status(404).json({ error: 'User not found' });

        const profileContext = `Name: ${user.name}, Academics: ${user.academicBg}, Goals: ${user.goals}, Skills: ${user.skills.map(s => s.skill.name).join(', ')}`;

        let currentSessionId = chatSessionId;
        
        // Create new session if none exists
        if (!currentSessionId) {
            const newSession = await prisma.chatSession.create({
                data: { userId }
            });
            currentSessionId = newSession.id;
        }

        // Save user message
        await prisma.message.create({
            data: { chatSessionId: currentSessionId, role: 'user', content: message }
        });

        // Get past messages
        const messages = await prisma.message.findMany({
            where: { chatSessionId: currentSessionId },
            orderBy: { createdAt: 'asc' }
        });

        // Call AI
        const aiResponse = await AIService.chat(messages, message, profileContext);

        if(!aiResponse) throw new Error("No response from AI");

        // Save AI response
        await prisma.message.create({
            data: { chatSessionId: currentSessionId, role: 'ai', content: aiResponse }
        });

        res.json({ reply: aiResponse, chatSessionId: currentSessionId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Chat failed' });
    }
});

export default router;
