# Interview Management System

This project is a simple Interview Management System built with **Next.js** (App Router), **Prisma** as the ORM, and **PostgreSQL** as the database. The system allows managing mock interviews, fetching interview details, and displaying them using both server and client components in a structured way.

---

## Features
- **Server-Side Rendering (SSR):** Utilizes Server Components for fetching data.
- **Interactive Client Components:** For rendering interactive interview details.
- **Database Integration:** Built with Prisma and PostgreSQL.
- **Generative AI Integration:** Uses the **Gemini-Flash-1.5-8b** model to generate interview questions, feedback for user answers, and ratings by comparing user responses with AI-generated answers.
- **Speech Recognition:** Uses **Google Speech-to-Text API** for voice input.
- **Modern UI:** Built with **shadcn** and **Tailwind CSS**.

---

## Technologies Used
- **Next.js** (App Router)
- **Prisma** (ORM)
- **PostgreSQL** (Database)
- **React**
- **Gemini-Flash-1.5-8b** (AI Model)
- **Google Speech-to-Text API**

---

## Prerequisites
1. Node.js (>= 16.x)
2. PostgreSQL installed locally or a cloud-based instance.
3. Environment variables configured (see `.env` section below).

---

## Installation

### 1. Clone the Repository
```bash
# Clone this repository
git clone https://github.com/abhi9ab/20th-dec-ps-1.git

# Navigate into the project directory
cd 20th-dec-ps-1
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

## Steps to Reproduce

1. Clone the repository and follow the installation instructions above.
2. Add mock data to the database using Prisma Studio:
   ```bash
   npx prisma studio
   ```
   Add entries to the `MockInterview` table with fields like `id`, `jobPosition`, `jobDesc`, `jobExperience`, etc.
3. Visit the home page to see a list of interviews rendered from the database.

---

## File Structure
```plaintext
src/
├── app/
│   ├── page.tsx                # Main dashboard page
│   ├── _components/
│   │   ├── InterviewListServer.tsx  # Server Component for fetching data
│   │   ├── InterviewListClient.tsx  # Client Component for rendering data
├── lib/
│   ├── prisma.ts               # Prisma client instance
├── prisma/
│   ├── schema.prisma           # Database schema definition
.env                            # Environment variables
```

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

## Known Issues

1. **Hydration Mismatch Error:**
   Ensure no server-side logic or dynamic data (like `Date.now()`) is used directly in Client Components.

2. **PrismaClient Error:**
   Make sure the Prisma Client is not bundled into browser-side code. All Prisma queries should run in Server Components or API routes.

3. **Async/Await in Client Components:**
   Avoid using async/await directly in Client Components. Use Server Components or API routes for asynchronous operations.

---

## Deployment
1. Use a platform like Vercel for deploying the Next.js app.
2. Ensure environment variables are set up in the hosting provider’s dashboard.
3. Use a cloud database service like AWS RDS or Supabase for PostgreSQL.

---

## Contact
For further queries, please contact [your.email@example.com](mailto:abhinabdas@example.com).

