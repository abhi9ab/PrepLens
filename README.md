# PrepLens: Interview Management System

## The Dev Challenge 2025: [Recognized as a Winner in the hackathon](https://devpost.com/software/preplens)

Welcome to the AI-Powered Interview Preparation Platform! This innovative application bridges the gap between traditional placement preparation and real-world interview success by simulating realistic interviews, offering personalized feedback, evaluating resumes, and providing targeted technical training.

---

### Resume review
![Screenshot From 2025-01-01 22-55-37](https://github.com/user-attachments/assets/f910532b-4dc5-46f5-8dcd-f89a77d6a338)

### Face analysis
![face-blur-for-preplens](https://github.com/user-attachments/assets/a79443ed-ff79-46c5-bed1-ec04f345d74e)

### Feedback generation
![Screenshot From 2025-01-01 22-55-58](https://github.com/user-attachments/assets/bfa287b3-de47-475e-b902-fb736f13ac2a)


---

## Features

### 1. Realistic Interview Simulations  
- **Question Generation:** Generates interview questions based on job descriptions.  
- **Speech-to-Text Conversion:** Records and transcribes user responses using React Speech-to-Text.  
- **Feedback & Rating:** Provides real-time feedback and ratings for each answer using Gemini AI.  

### 2. Resume Analysis  
- **ATS Scoring:** Analyzes uploaded resumes and generates ATS scores.  
- **Keyword Suggestions:** Identifies missing keywords relevant to the job description.  

### 3. Face and Posture Analysis  
- **Real-Time Feedback:** Monitors user’s face and posture during mock interviews using Face-API.js.  
- **Alert System: Alerts:** users if they move out of the webcam frame.  

### 4. Comprehensive Feedback
- **Detailed Reports:** Summarizes performance with actionable insights.  
- **Confidence Building:** Enhances interview readiness with iterative practice and personalized guidance.  

---

## Tech Stack  

### Frontend & Backend  
**Next.js:** Framework for building the user interface.  
**TypeScript:** Ensures type safety and scalability.  
**ShadCN-UI:** Provides modern and accessible UI components.  
**react-hook-peech-to-text:** Powers the speech recognition feature.  

### AI & APIs  
**Gemini AI:** Used for question generation, feedback, and resume ATS scoring.  
**Face-API.js:** Powers real-time facial and posture analysis.  

### Other Tools
**Prisma:** Manages database interactions.  
**Supabase:** Handles authentication and storage.  
**Framer Motion:** Adds animations for a dynamic user experience.  

---

## Prerequisites
1. Node.js (>= 16.x)
2. Environment variables configured (see `.env` section below).

---

## Installation

### 1. Clone the Repository
```bash
# Clone this repository
git clone https://github.com/abhi9ab/Interview-Preparation-App.git

# Navigate into the project directory
cd Interview-Preparation-App
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

NEXT_PUBLIC_GEMINI_API_KEY=

NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT=5

# Connect to Supabase via connection pooling with Supavisor.
DATABASE_URL=

# Direct connection to the database. Used for migrations.
DIRECT_URL=
        
NEXT_PUBLIC_GOOGLE_API_KEY=
```

### 4. Set Up Prisma

1. Generate the Prisma Client:
```bash
npx prisma generate
```

2. Apply migrations to the database:
```bash
npx prisma migrate dev --name init
```

### 5. Run the Development Server
```bash
npm run dev
```

The application will now be available at `http://localhost:3000`.

---

## API Keys Needed
This project requires the following API keys:

1. **Clerk:**
   - **`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`**: Your Clerk Publishable Key.
   - **`CLERK_SECRET_KEY`**: Your Clerk Secret Key.
   
   To obtain these keys:
   - Sign up at [Clerk.dev](https://clerk.dev).
   - Create a new application and retrieve the required keys from the dashboard.

2. **Gemini-Flash-1.5-8b API Key:**
   - **`NEXT_PUBLIC_GEMINI_API_KEY`**: API key for accessing the Gemini model.

3. **Google Speech-to-Text API Key:**
   - **`NEXT_PUBLIC_GOOGLE_API_KEY`**: API key for speech recognition.

---

## Contributing  
**Contributions are welcome! Please follow these steps:**  
- Fork the repository.  
- Create a new branch for your feature or bugfix.  
- Commit your changes and push to the branch.  
- Submit a pull request.  

---

## Deployment
1. Use a platform like Vercel for deploying the Next.js app.
2. Ensure environment variables are set up in the hosting provider’s dashboard.
3. Use a cloud database service like AWS RDS or Supabase for PostgreSQL.

---

## Contact
For further queries, please contact [abhinabdas004@gmail.com](mailto:abhinabdas004@gmail.com).

## License  
This project is licensed under the MIT License. See the [LICENSE file](https://github.com/abhi9ab/Interview-Preparation-App/blob/main/LICENSE) for details.
