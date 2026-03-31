"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const ai_service_1 = require("../services/ai.service");
const mongodb_1 = require("mongodb");
const router = (0, express_1.Router)();
// 3 & 4. POST /analyze-skills & GET recommendations
router.post('/career/analyze', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId)
            return res.status(400).json({ error: 'userId is required' });
        const db = (0, db_1.getDB)();
        const userObjId = new mongodb_1.ObjectId(userId);
        const user = await db.collection('User').findOne({ _id: userObjId });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Lookup skills and interests manually
        const userSkills = await db.collection('UserSkill').find({ userId }).toArray();
        const userInterests = await db.collection('UserInterest').find({ userId }).toArray();
        const skillDocs = await Promise.all(userSkills.map(async (us) => {
            const sk = await db.collection('Skill').findOne({ _id: new mongodb_1.ObjectId(us.skillId) });
            return { skill: sk };
        }));
        const intDocs = await Promise.all(userInterests.map(async (ui) => {
            const i = await db.collection('Interest').findOne({ _id: new mongodb_1.ObjectId(ui.interestId) });
            return { interest: i };
        }));
        const fullUser = {
            ...user,
            skills: skillDocs,
            interests: intDocs
        };
        // Call AI Service
        const recommendations = await ai_service_1.AIService.analyzeProfile(fullUser);
        // Save recommendations to DB
        const savedRecs = [];
        for (const rec of recommendations) {
            const result = await db.collection('Recommendation').insertOne({
                userId,
                title: rec.title,
                description: rec.description,
                roadmap: JSON.stringify(rec.roadmap),
                skillGap: JSON.stringify(rec.skillGap),
                createdAt: new Date()
            });
            const savedDoc = await db.collection('Recommendation').findOne({ _id: result.insertedId });
            if (savedDoc) {
                savedRecs.push({
                    ...savedDoc,
                    id: savedDoc._id.toString(),
                    roadmap: typeof savedDoc.roadmap === 'string' ? JSON.parse(savedDoc.roadmap) : savedDoc.roadmap,
                    skillGap: typeof savedDoc.skillGap === 'string' ? JSON.parse(savedDoc.skillGap) : savedDoc.skillGap
                });
            }
        }
        res.json({ recommendations: savedRecs });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Analysis failed' });
    }
});
// 5. GET /learning-roadmap
router.get('/career/roadmap/:recommendationId', async (req, res) => {
    try {
        const db = (0, db_1.getDB)();
        const rec = await db.collection('Recommendation').findOne({ _id: new mongodb_1.ObjectId(req.params.recommendationId) });
        if (!rec)
            return res.status(404).json({ error: 'Not found' });
        res.json(typeof rec.roadmap === 'string' ? JSON.parse(rec.roadmap) : rec.roadmap);
    }
    catch (e) {
        res.status(500).json({ error: 'Failed' });
    }
});
exports.default = router;
//# sourceMappingURL=career.routes.js.map