"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const ai_service_1 = require("../services/ai.service");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
// 2. POST /ask-career-question
router.post('/chat', async (req, res) => {
    try {
        const { userId, message, chatSessionId } = req.body;
        const db = (0, db_1.getDB)();
        const userObjId = new mongodb_1.ObjectId(userId);
        const user = await db.collection('User').findOne({ _id: userObjId });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Lookup skills and interests
        const userSkills = await db.collection('UserSkill').find({ userId }).toArray();
        const skillDocs = await Promise.all(userSkills.map(async (us) => {
            const sk = await db.collection('Skill').findOne({ _id: new mongodb_1.ObjectId(us.skillId) });
            return sk?.name;
        }));
        const profileContext = `Name: ${user.name}, Academics: ${user.academicBg}, Goals: ${user.goals}, Skills: ${skillDocs.join(', ')}`;
        let currentSessionId = chatSessionId;
        // Create new session if none exists
        if (!currentSessionId) {
            const newSession = await db.collection('ChatSession').insertOne({
                userId,
                createdAt: new Date()
            });
            currentSessionId = newSession.insertedId.toString();
        }
        // Save user message
        await db.collection('Message').insertOne({
            chatSessionId: new mongodb_1.ObjectId(currentSessionId),
            role: 'user',
            content: message,
            createdAt: new Date()
        });
        // Get past messages
        const dbMessages = await db.collection('Message').find({
            chatSessionId: new mongodb_1.ObjectId(currentSessionId)
        }).sort({ createdAt: 1 }).toArray();
        // format for AI
        const messages = dbMessages.map(m => ({ role: m.role, content: m.content }));
        // Call AI
        const aiResponse = await ai_service_1.AIService.chat(messages, message, profileContext);
        if (!aiResponse)
            throw new Error("No response from AI");
        // Save AI response
        await db.collection('Message').insertOne({
            chatSessionId: new mongodb_1.ObjectId(currentSessionId),
            role: 'ai',
            content: aiResponse,
            createdAt: new Date()
        });
        res.json({ reply: aiResponse, chatSessionId: currentSessionId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Chat failed' });
    }
});
exports.default = router;
//# sourceMappingURL=chat.routes.js.map