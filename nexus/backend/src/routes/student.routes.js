"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const router = (0, express_1.Router)();
// 1. POST /student-profile
router.post('/student-profile', async (req, res) => {
    try {
        const { name, email, academicBg, goals, skills, interests } = req.body;
        // Very basic validation
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        const db = (0, db_1.getDB)();
        // Upsert User
        const userResult = await db.collection('User').findOneAndUpdate({ email }, { $set: { name, email, academicBg, goals }, $setOnInsert: { createdAt: new Date() } }, { upsert: true, returnDocument: 'after' });
        const user = userResult;
        // Handle Skills (simplified for MVP)
        if (skills && Array.isArray(skills)) {
            for (const skillName of skills) {
                const skillResult = await db.collection('Skill').findOneAndUpdate({ name: skillName.toLowerCase() }, { $set: { name: skillName.toLowerCase() } }, { upsert: true, returnDocument: 'after' });
                // Link to user (mimicking joint table for frontend compatibility)
                if (skillResult && user) {
                    await db.collection('UserSkill').updateOne({ userId: user._id.toString(), skillId: skillResult._id.toString() }, { $set: { userId: user._id.toString(), skillId: skillResult._id.toString() } }, { upsert: true });
                }
            }
        }
        // Handle Interests
        if (interests && Array.isArray(interests)) {
            for (const interestName of interests) {
                const interestResult = await db.collection('Interest').findOneAndUpdate({ name: interestName.toLowerCase() }, { $set: { name: interestName.toLowerCase() } }, { upsert: true, returnDocument: 'after' });
                if (interestResult && user) {
                    await db.collection('UserInterest').updateOne({ userId: user._id.toString(), interestId: interestResult._id.toString() }, { $set: { userId: user._id.toString(), interestId: interestResult._id.toString() } }, { upsert: true });
                }
            }
        }
        res.status(200).json({ message: 'Profile updated successfully', user });
    }
    catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: 'Failed to save student profile' });
    }
});
// 6. GET /student-history
router.get('/student-history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = (0, db_1.getDB)();
        const dbRecommendations = await db.collection('Recommendation').find({ userId }).sort({ createdAt: -1 }).toArray();
        const recommendations = dbRecommendations.map((rec) => ({
            ...rec,
            id: rec._id.toString(),
            roadmap: typeof rec.roadmap === 'string' ? JSON.parse(rec.roadmap) : rec.roadmap,
            skillGap: typeof rec.skillGap === 'string' ? JSON.parse(rec.skillGap) : rec.skillGap
        }));
        const chats = await db.collection('ChatSession').aggregate([
            { $match: { userId } },
            {
                $lookup: {
                    from: 'Message',
                    localField: '_id',
                    foreignField: 'chatSessionId',
                    as: 'messages'
                }
            },
            { $sort: { createdAt: -1 } }
        ]).toArray();
        // Map _id to id for frontend
        const mappedChats = chats.map(c => ({
            ...c,
            id: c._id.toString(),
            messages: c.messages.map((m) => ({ ...m, id: m._id.toString() }))
        }));
        res.json({ recommendations, chats: mappedChats });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});
exports.default = router;
//# sourceMappingURL=student.routes.js.map