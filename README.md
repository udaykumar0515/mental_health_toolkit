# Mental Health Toolkit

A comprehensive full-stack application for mental health assessment, stress tracking, breathing exercises, and wellness management. Designed to help users understand and manage their stress levels with personalized recommendations.

## 🌐 Live Demo

**Try MindEase now:** [https://mindease-mental-health-toolkit.web.app/](https://mindease-mental-health-toolkit.web.app/)

---

## 🎯 Project Overview

The Mental Health Toolkit is a two-part application:

- **Frontend**: React + TypeScript application with a modern, responsive UI
- **Backend**: Node.js/Express API with secure authentication and data persistence

### Key Features

- 🧠 **Stress Assessment**: 17-question assessment to evaluate stress levels
- 🌬️ **Guided Breathing Exercises**: Interactive breathing sessions with cycle tracking
- 📊 **Progress Tracking**: View assessment history and trends
- 👤 **User Profiles**: Personalized dashboards with stats and recommendations
- 🔐 **Secure Authentication**: JWT-based auth with password hashing
- 💾 **Data Persistence**: All data saved to JSON files

---

## 📸 Screenshots

### Sign In Page
![Sign In Page](screenshots/signin_page.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Stress Assessment Results
![Assessment Results](screenshots/assignment_result_page.png)

### Breathing Exercise
![Breathing Exercise](screenshots/breathing_exerice_page.png)

### CalmBot AI Chatbot
![CalmBot in Action](screenshots/calmbot_inaction.png)

### Thought Reframer
![Thought Reframer](screenshots/thought_reframer.png)

### Journal Entry
![Journal Entry](screenshots/journal_entry.png)

### Mood Tracker & Music Player
![Music Player](screenshots/music_player.png)

### Profile Page
![Profile Page](screenshots/profile_page.png)

### Feedback Page
![Feedback Page](screenshots/feedback_page.png)

---

## 📁 Project Structure

```
mental_health_toolkit/
├── server/                    # Backend (Node.js/Express)
│   ├── index.js              # Server entry point
│   ├── database.js           # Data persistence layer
│   ├── auth.js               # Authentication middleware
│   ├── routes/               # API endpoints
│   │   ├── auth.js          # Auth routes (signup, login)
│   │   ├── assessment.js    # Assessment submission & history
│   │   ├── breathing.js     # Breathing session routes
│   │   ├── profile.js       # User profile routes
│   │   └── questions.js     # Assessment questions
│   ├── data/                # JSON data files
│   │   ├── users.json       # User accounts
│   │   ├── assessments.json # Stress assessments
│   │   ├── breathing_sessions.json # Breathing data
│   │   └── questions.json   # Assessment questions
│   └── package.json
│
└── stress-minder/            # Frontend (React/TypeScript)
    ├── src/
    │   ├── pages/           # Page components
    │   │   ├── Index.tsx    # Home/Dashboard
    │   │   ├── Auth.tsx     # Login/Signup
    │   │   ├── Profile.tsx  # User profile
    │   │   ├── Breathing.tsx # Breathing exercises
    │   │   └── NotFound.tsx # 404 page
    │   ├── components/      # Reusable components
    │   │   ├── assessment/  # Assessment components
    │   │   ├── auth/        # Auth components
    │   │   ├── breathing/   # Breathing components
    │   │   └── ui/          # shadcn/ui components
    │   ├── integrations/api/ # API client
    │   ├── hooks/           # Custom React hooks
    │   ├── lib/             # Utility functions
    │   └── App.tsx          # Main app component
    ├── index.html           # HTML entry point
    ├── vite.config.ts       # Vite configuration
    ├── tailwind.config.ts   # Tailwind CSS config
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16 or higher
- **npm** v7 or higher
- **Git** (optional, for cloning)

### 1️⃣ Backend Setup

#### Step 1: Navigate to server directory

```bash
cd server
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Create environment file (optional)

The server works without `.env`, but you can create one:

```bash
echo "PORT=5000" > .env
```

#### Step 4: Start the server

```bash
npm run dev
# or
npm start
```

**Expected output:**
```
Server running on http://localhost:5000
```

#### API Endpoints Available:

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user
- `POST /api/assessment/submit` - Submit assessment
- `GET /api/assessment/history` - Get assessment history
- `GET /api/assessment/latest` - Get latest assessment
- `GET /api/questions` - Fetch questions
- `POST /api/breathing/sessions` - Save breathing session
- `GET /api/breathing/sessions` - Get breathing sessions
- `GET /api/profile` - Get user profile

---

### 2️⃣ Frontend Setup

#### Step 1: Open new terminal, navigate to frontend

```bash
cd stress-minder
```

#### Step 2: Install dependencies

```bash
npm install
```

#### Step 3: Start development server

```bash
npm run dev
```

**Expected output:**
```
VITE v5.4.19  ready in 234 ms

➜  Local:   http://localhost:8080/
➜  press h to show help
```

#### Step 4: Open in browser

Visit `http://localhost:8080` in your web browser

---

## 📖 How the Stress Assessment Works

### Assessment Flow

1. **User takes 17-question assessment**
   - Questions cover stress, anxiety, sleep, mood, physical symptoms, etc.
   - Each question has 4 options: "Never" (0) → "Almost always" (3)

2. **Score Calculation**
   - Each answer is scored 0-3 points
   - Total raw score = sum of all 17 answers
   - Maximum possible score = 17 × 3 = 51 points

3. **Percentage Conversion**
   - Stress percentage = (Raw Score ÷ 51) × 100
   - Example: Raw Score of 25 = (25 ÷ 51) × 100 = **49%**

4. **Stress Level Classification**
   - **Low**: 0-30%
   - **Moderate**: 31-60%
   - **High**: 61-80%
   - **Severe**: 81-100%

5. **Recommendations**
   - Based on stress level, user receives targeted recommendations
   - Low stress → "Maintain current wellness habits"
   - Moderate → "Try breathing exercises, take breaks"
   - High → "Consider professional support"
   - Severe → "Seek professional help immediately"

### Real-World Example

**Scenario**: User answers assessment

```
Question 1: "How often have you felt nervous?" → Sometimes (1 point)
Question 2: "Trouble relaxing?" → Often (2 points)
Question 3: "Feel overwhelmed?" → Sometimes (1 point)
... (14 more questions)
Question 17: "Stress impact appetite?" → Almost always (3 points)

Raw Score: 1+2+1+2+2+3+2+1+2+2+3+1+2+2+2+3+3 = 35 points
Percentage: (35 ÷ 51) × 100 = 68.6%
Classification: HIGH stress level
Recommendations: 
  - Consider speaking to a friend or counselor
  - Practice relaxation techniques daily
  - Set boundaries and prioritize self-care
  - Seek professional support if needed
```

---

## 🔐 Authentication System

### How Login Works

1. **Signup**: User provides email, password, and full name
   - Password is hashed using bcryptjs
   - User account created in `server/data/users.json`

2. **Login**: User provides email and password
   - Password verified against hashed password
   - JWT token generated (7-day expiration)
   - Token stored in browser's localStorage

3. **Protected Routes**: Every API request includes JWT token
   ```javascript
   // Token sent in Authorization header
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

4. **Token Validation**: Backend verifies token on each request
   - If valid: request proceeds
   - If expired/invalid: user redirected to login

---

## 🌬️ Breathing Exercise Feature

Users can perform guided breathing exercises:

- **Duration**: Customizable (default 2 minutes)
- **Cycles**: Inhale → Hold → Exhale (4-4-4 seconds)
- **Tracking**: Session saved with:
  - Duration in seconds
  - Number of cycles completed
  - Timestamp

**Example saved session:**
```json
{
  "id": "session_1700000000000",
  "user_id": "user123",
  "duration_seconds": 120,
  "cycles_completed": 10,
  "created_at": "2025-11-16T10:30:00.000Z"
}
```

---

## 📊 Data Storage

All data is stored in JSON files in `server/data/`:

### users.json
```json
{
  "id": "user_1700000000000",
  "email": "john@example.com",
  "password": "$2a$10$...", // bcrypt hashed
  "full_name": "John Doe",
  "created_at": "2025-11-16T10:00:00.000Z"
}
```

### assessments.json
```json
{
  "id": "assessment_1700000000000",
  "user_id": "user_1700000000000",
  "stress_level": "moderate",
  "score": 52,
  "answers": {
    "q1": 2,
    "q2": 3,
    ...
  },
  "recommendations": [...],
  "created_at": "2025-11-16T10:30:00.000Z"
}
```

### questions.json
```json
[
  {
    "id": "q1",
    "text": "How often have you felt nervous or stressed in the last week?",
    "options": ["Never", "Sometimes", "Often", "Almost always"]
  },
  ...
]
```

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - UI framework
- **TypeScript** 5.8.3 - Type safety
- **Vite** 5.4.19 - Build tool (3x faster than Create React App)
- **Tailwind CSS** 3.4.17 - Utility-first CSS
- **shadcn/ui** - Component library
- **Recharts** 2.15.4 - Charts and visualizations
- **React Router** v6 - Client-side routing
- **Sonner** 1.7.4 - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** with **Express** 4.18.2 - Server framework
- **bcryptjs** 2.4.3 - Password hashing
- **jsonwebtoken** 9.0.0 - JWT authentication
- **CORS** 2.8.5 - Cross-origin requests
- **fs** (built-in) - File operations

---

## 📝 API Documentation

### Authentication

#### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe"
}

Response: { token, user: { id, email, full_name } }
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { token, user: { id, email, full_name } }
```

### Assessment

#### Submit Assessment
```bash
POST /api/assessment/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": { "q1": 2, "q2": 3, ... },
  "stress_level": "moderate",
  "score": 52,
  "recommendations": [...]
}

Response: { id, stress_level, score, created_at }
```

#### Get History
```bash
GET /api/assessment/history
Authorization: Bearer {token}

Response: [{ id, stress_level, score, created_at }, ...]
```

### Breathing

#### Save Session
```bash
POST /api/breathing/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "duration_seconds": 120,
  "cycles_completed": 10
}

Response: { id, duration_seconds, cycles_completed, created_at }
```

#### Get Sessions
```bash
GET /api/breathing/sessions
Authorization: Bearer {token}

Response: [{ id, duration_seconds, cycles_completed, created_at }, ...]
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::5000`

**Solution**: Change port in `server/index.js`
```javascript
const PORT = process.env.PORT || 3001; // Use 3001 instead
```

### CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: CORS is already enabled in backend. Make sure:
- Backend is running on `http://localhost:5000`
- Frontend is running on `http://localhost:8080`

### Login Not Working

**Problem**: "Invalid email or password"

**Solutions**:
1. Make sure you signed up first
2. Check that email is correct (case-insensitive)
3. Check `server/data/users.json` exists
4. Restart both servers

### Questions Not Loading

**Problem**: Assessment page shows "No questions available"

**Solutions**:
1. Ensure `server/data/questions.json` exists
2. Check that questions.json has valid JSON format
3. Verify backend is running
4. Check browser console for errors

---

## 🚢 Deployment (Future)

To deploy this project:

### Backend
- Host on: Heroku, Railway, Render, or AWS
- Use environment variables for sensitive data
- Consider switching from JSON files to a database

### Frontend
- Build: `npm run build`
- Host on: Vercel, Netlify, GitHub Pages, or AWS
- Update API URL in `.env` to deployed backend URL

---

## 📧 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: udaykumar0515@example.com

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy coding! 💙**
