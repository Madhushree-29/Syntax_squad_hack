# NODENEXUS 🧠🚀
A scalable, AI-powered Career Guidance System built for engineering students. This platform analyzes a student's skills, academic background, and interests to generate personalized career recommendations, actionable learning roadmaps, and skill gap analyses. It also features a 24/7 AI Career Counselor chat interface.

## 🏗️ System Architecture

The project is structured as a modern Full-Stack application, utilizing a clean separation of concerns for maximum modularity and scalability.

- **Frontend (Next.js):** Provides a stunning, responsive, and dynamic user interface. Uses Tailwind CSS for styling, Framer Motion for micro-animations, and Zustand for global state management.
- **Backend (Node.js & Express):** A robust REST API server that handles business logic, security, database transactions, and communication with the AI engine.
- **Database (PostgreSQL via Prisma):** A relational database storing user profiles, master lists of skills/interests, and tracking the history of career recommendations and chat sessions.
- **AI Integration (Google Gemini API):** Powers the core intelligence of the application, analyzing complex user data matrices against current industry demands to generate structured JSON roadmaps and conversational advice.

## 📂 Project Structure

```text
NODENEXUS/
├── frontend/               # Next.js Application
│   ├── src/app/            # App Router pages (Home, Onboarding, Dashboard, Chat)
│   ├── src/components/     # Reusable UI components (Navbar)
│   ├── src/store/          # Zustand global state store
│   └── tailwind.config.ts  # Tailwind settings
│
├── backend/                # Node.js + Express
│   ├── src/index.ts        # Express entry point
│   ├── src/routes/         # API endpoints (Student, Career, Chat)
│   ├── src/services/       # AI logic module
│   ├── prisma/schema.prisma# Database schemas
│   └── .env                # Environment variables
└── README.md
```

## 🔌 Core API Endpoints

- `POST /api/student-profile` - Creates/upserts a student profile, including their academics, skills, and interests.
- `POST /api/career/analyze` - Triggers the AI to generate structured career recommendations and detailed skill gap analyses.
- `GET /api/student-history/:userId` - Fetches the user's past recommendations and their chat session logs for the dashboard.
- `POST /api/chat` - The interactive chat endpoint that passes the message and user profile context to the AI model.

## 🚀 Setup Instructions

Follow these instructions to run NODENEXUS locally.

### 1. Database & Environment Configuration

1. You need a running **PostgreSQL** instance. 
2. Open `backend/.env.example`, rename it to `.env` (or copy it).
3. Update `.env` with your actual Postgres `DATABASE_URL` and your `GEMINI_API_KEY`.

### 2. Backend Setup

Open a terminal and run the following commands:
```bash
cd backend
npm install
npx prisma db push
npx prisma generate
npm run dev
```
*(The backend runs on `http://localhost:8000`)*

### 3. Frontend Setup

Open another terminal and run the following commands:
```bash
cd frontend
npm install
npm run dev
```
*(The frontend runs on `http://localhost:3000`)*

Enjoy your AI-powered career counselor! 🎉
