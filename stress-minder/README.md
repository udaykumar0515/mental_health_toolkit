# Mental Health Toolkit

A comprehensive full-stack application for mental health assessment, stress tracking, breathing exercises, and wellness management. Designed to help users understand and manage their stress levels with personalized recommendations.

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
Question 4: "Poor sleep?" → Often (2 points)
Question 5: "Stress affecting daily life?" → Moderately (2 points)
Question 6: "Feel irritable?" → Often (3 points)
Question 7: "Difficulty concentrating?" → Sometimes (2 points)
Question 8: "Feel hopeless?" → Never (1 point)
Question 9: "Physical symptoms?" → Often (2 points)
Question 10: "Anxious about future?" → Often (2 points)
Question 11: "Trouble controlling worries?" → Often (3 points)
Question 12: "Unhealthy coping?" → Sometimes (1 points)
Question 13: "Lack motivation?" → Often (2 points)
Question 14: "Difficulty deciding?" → Often (2 points)
Question 15: "Feel isolated?" → Sometimes (2 points)
Question 16: "Racing thoughts?" → Almost always (3 points)
Question 17: "Stress impact appetite?" → Almost always (3 points)

Raw Score: 1+2+1+2+2+3+2+1+2+2+3+1+2+2+2+3+3 = 35 points

Stress Percentage: (35 ÷ 51) × 100 = 68.6%

Stress Level: HIGH (61-80% range)

Recommendations: 
  ✓ Consider speaking to a friend or counselor
  ✓ Practice relaxation techniques daily
  ✓ Set boundaries and prioritize self-care
  ✓ Seek professional support if needed
```

**What this means**: This user is experiencing high stress levels and should consider seeking professional support while implementing self-care strategies.

---

## 🔐 Authentication System

### How Login Works

1. **Signup**: User provides email, password, and full name
   - Password is hashed using bcryptjs (not stored in plain text)
   - User account created in `server/data/users.json`
   - User is logged in automatically with JWT token

2. **Login**: User provides email and password
   - Email and password verified against stored user data
   - If credentials match, JWT token is generated
   - Token valid for 7 days
   - Token stored in browser's localStorage with key `auth_token`

3. **Protected Routes**: Every API request includes JWT token
   ```javascript
   // Token sent in Authorization header
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Token Validation**: Backend verifies token on each request
   - If valid and not expired: request proceeds
   - If expired or invalid: user redirected to login page
   - User data cannot be accessed without valid token

---

## 🌬️ Breathing Exercise Feature

Users can perform guided breathing exercises:

- **Duration**: Customizable (default 2 minutes per session)
- **Technique**: 4-4-4 breathing
  - Inhale for 4 seconds
  - Hold for 4 seconds
  - Exhale for 4 seconds
- **Tracking**: Session data saved with:
  - Duration in seconds
  - Number of cycles completed
  - Exact timestamp

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

**Profile Impact**: 
- Sessions are displayed on user profile
- Shows total breathing sessions completed
- Lists all sessions with duration and date/time

---

## 📊 Data Storage

All data is stored in JSON files located in `server/data/`:

### users.json
```json
[
  {
    "id": "user_1700000000000",
    "email": "john@example.com",
    "password": "$2a$10$...", // bcrypt hashed - 10 salt rounds
    "full_name": "John Doe",
    "created_at": "2025-11-16T10:00:00.000Z"
  }
]
```

### assessments.json
```json
[
  {
    "id": "assessment_1700000000000",
    "user_id": "user_1700000000000",
    "stress_level": "moderate",
    "score": 52,
    "answers": {
      "q1": 2,
      "q2": 3,
      "q3": 1,
      // ... 14 more answers
    },
    "recommendations": [
      "Try short breathing exercises",
      "Take short breaks during work",
      "Practice mindfulness techniques",
      "Spend time on relaxing activities"
    ],
    "created_at": "2025-11-16T10:30:00.000Z"
  }
]
```

### questions.json
```json
[
  {
    "id": "q1",
    "text": "How often have you felt nervous or stressed in the last week?",
    "options": ["Never", "Sometimes", "Often", "Almost always"]
  },
  {
    "id": "q2",
    "text": "How often have you had trouble relaxing?",
    "options": ["Never", "Sometimes", "Often", "Almost always"]
  }
  // ... 15 more questions
]
```

### breathing_sessions.json
```json
[
  {
    "id": "session_1700000000000",
    "user_id": "user_1700000000000",
    "duration_seconds": 120,
    "cycles_completed": 10,
    "created_at": "2025-11-16T10:30:00.000Z"
  }
]
```

---

## 🛠️ Tech Stack

### Frontend
- **React** 18.3.1 - Modern UI library
- **TypeScript** 5.8.3 - Type safety and better DX
- **Vite** 5.4.19 - Lightning-fast build tool (3x faster than Create React App)
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Recharts** 2.15.4 - Charts and data visualization
- **React Router** v6 - Client-side routing
- **Sonner** 1.7.4 - Toast notifications
- **Lucide React** - Beautiful icon library (500+ icons)
- **React Hook Form** - Form state management
- **React Query** - Data fetching and caching

### Backend
- **Node.js** - JavaScript runtime
- **Express** 4.18.2 - Web framework
- **bcryptjs** 2.4.3 - Password hashing (industry standard)
- **jsonwebtoken** 9.0.0 - JWT authentication
- **CORS** 2.8.5 - Cross-origin resource sharing
- **fs** (built-in) - File system operations for JSON storage

---

## 📝 API Documentation

### Authentication Endpoints

#### Signup
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe"
}

Response (201):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_1700000000000",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_1700000000000",
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

#### Get Current User
```bash
GET /api/auth/user
Authorization: Bearer {token}

Response (200):
{
  "id": "user_1700000000000",
  "email": "user@example.com",
  "full_name": "John Doe"
}
```

### Assessment Endpoints

#### Get Questions
```bash
GET /api/questions

Response (200):
[
  {
    "id": "q1",
    "text": "How often have you felt nervous...",
    "options": ["Never", "Sometimes", "Often", "Almost always"]
  },
  // ... 16 more questions
]
```

#### Submit Assessment
```bash
POST /api/assessment/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": {
    "q1": 2,
    "q2": 3,
    // ... all 17 answers
  },
  "stress_level": "moderate",
  "score": 52,
  "recommendations": [...]
}

Response (201):
{
  "id": "assessment_1700000000000",
  "user_id": "user_1700000000000",
  "stress_level": "moderate",
  "score": 52,
  "created_at": "2025-11-16T10:30:00.000Z"
}
```

#### Get Assessment History
```bash
GET /api/assessment/history
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "assessment_1700000000000",
    "stress_level": "moderate",
    "score": 52,
    "created_at": "2025-11-16T10:30:00.000Z"
  },
  // ... previous assessments
]
```

#### Get Latest Assessment
```bash
GET /api/assessment/latest
Authorization: Bearer {token}

Response (200):
{
  "id": "assessment_1700000000000",
  "stress_level": "moderate",
  "score": 52,
  "created_at": "2025-11-16T10:30:00.000Z"
}
```

### Breathing Endpoints

#### Save Breathing Session
```bash
POST /api/breathing/sessions
Authorization: Bearer {token}
Content-Type: application/json

{
  "duration_seconds": 120,
  "cycles_completed": 10
}

Response (201):
{
  "id": "session_1700000000000",
  "user_id": "user_1700000000000",
  "duration_seconds": 120,
  "cycles_completed": 10,
  "created_at": "2025-11-16T10:30:00.000Z"
}
```

#### Get All Breathing Sessions
```bash
GET /api/breathing/sessions
Authorization: Bearer {token}

Response (200):
[
  {
    "id": "session_1700000000000",
    "duration_seconds": 120,
    "cycles_completed": 10,
    "created_at": "2025-11-16T10:30:00.000Z"
  },
  // ... more sessions
]
```

### Profile Endpoint

#### Get User Profile
```bash
GET /api/profile
Authorization: Bearer {token}

Response (200):
{
  "total_assessments": 5,
  "average_score": 48,
  "last_assessment": {
    "stress_level": "moderate",
    "score": 52,
    "created_at": "2025-11-16T10:30:00.000Z"
  },
  "breathing_sessions_count": 8
}
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE :::5000`

**Solution**: The backend is already running. Either:
1. Stop the existing process: `Ctrl + C`
2. Or use a different port in `server/index.js`:
   ```javascript
   const PORT = process.env.PORT || 3001; // Use 3001 instead
   ```

### CORS Error in Console

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: 
1. Make sure backend is running: `http://localhost:5000`
2. Make sure frontend is running: `http://localhost:8080`
3. CORS is already enabled in the backend (see `server/index.js`)

### Login/Signup Not Working

**Problem**: "User already exists" or "Invalid email or password"

**Solutions**:
1. For signup: Make sure you haven't already signed up with that email
2. For login: Verify email and password are correct
3. Check `server/data/users.json` exists and has valid JSON
4. Restart both backend and frontend servers

### Questions Not Loading

**Problem**: Assessment page shows "No questions available"

**Solutions**:
1. Verify `server/data/questions.json` exists
2. Check the JSON format is valid (no syntax errors)
3. Ensure backend is running (`http://localhost:5000`)
4. Check browser console for detailed error messages
5. Restart the backend server

### Breathing Session Not Saving

**Problem**: Session completes but doesn't appear in profile

**Solutions**:
1. Make sure you're logged in (token in localStorage)
2. Check browser console for API errors
3. Verify `server/data/breathing_sessions.json` exists
4. Restart both servers and try again

### Data Disappears After Restart

**Problem**: Assessments or sessions deleted after server restart

**Info**: This is normal with JSON file storage. For production:
- Switch to a database (MongoDB, PostgreSQL, etc.)
- Or use cloud storage (Supabase, Firebase)
- See deployment section below

---

## 🚀 Building for Production

### Frontend Build
```bash
cd stress-minder

# Build optimized production bundle
npm run build

# Preview the production build
npm run preview
```

The `dist/` folder will contain your optimized app ready to deploy.

### Deployment Options

**Frontend Hosting:**
- **Vercel** (recommended for Vite)
  ```bash
  npm install -g vercel
  vercel
  ```
- **Netlify** - Connect GitHub repo directly
- **GitHub Pages** - Free hosting
- **AWS S3 + CloudFront**

**Backend Hosting:**
- **Heroku** (free tier discontinued, but low-cost options available)
- **Railway** - Simple, modern deployment
- **Render** - Free tier available
- **AWS EC2** - More control, more setup
- **DigitalOcean** - Affordable VPS

**For Production Backend:**
1. Replace JSON files with database (MongoDB, PostgreSQL)
2. Add environment variables (.env file)
3. Enable HTTPS
4. Add rate limiting
5. Add request logging
6. Add error tracking (Sentry)

---

## 📚 Learning Resources

- [React Docs](https://react.dev) - Official React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Type safety guide
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- [Express Guide](https://expressjs.com/en/guide/routing.html) - Backend routing
- [JWT Intro](https://jwt.io/introduction) - Authentication tokens
- [bcrypt Info](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) - Password security

---

## 📧 Support & Contact

For issues, questions, or suggestions:
- Open an issue on [GitHub](https://github.com/udaykumar0515/mental_health_toolkit)
- Contact: udaykumar0515@example.com

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

See LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Made with ❤️ by Uday Kumar**

**Happy coding! 💙**
