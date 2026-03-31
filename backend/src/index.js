"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Routes
// We will separate these into routes/ later, for now a health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
// Import route modules (will be created in next steps)
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const career_routes_1 = __importDefault(require("./routes/career.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
app.use('/api', student_routes_1.default);
app.use('/api', career_routes_1.default);
app.use('/api', chat_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
(0, db_1.connectDB)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
//# sourceMappingURL=index.js.map