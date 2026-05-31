# AI Resume Analyzer

A full-stack web application that parses your resume PDF, scores it using AI, and returns strengths, weaknesses, missing skills, and keyword match against a job description.

**Live Demo:** [Frontend](https://ai-resume-analyzer-nfj5.onrender.com) · [Backend API](https://ai-resume-analyzer-nfj5.onrender.com)

---

## Features

- Upload a resume as a PDF (up to 2 MB)
- Paste a job description to get a match score
- AI-powered analysis returns:
  - Overall resume score (0–100)
  - Match score against job description (0–100)
  - Strengths
  - Weaknesses
  - Missing skills
  - Missing keywords
- Clean, responsive UI

---

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, Vite, Axios               |
| Backend   | Node.js, Express, Multer, pdf-parse |
| AI        | OpenRouter API (GPT-4o-mini)        |
| Deployment | Render (backend), Vercel (frontend) |

---

## Project Structure

```
ai-resume-analyzer/
├── index.js          # Express backend
├── package.json      # Backend dependencies
├── .env              # API key (not committed)
└── client/
    ├── src/
    │   ├── App.jsx   # Main React component
    │   └── main.jsx  # React entry point
    ├── index.html
    └── package.json  # Frontend dependencies
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- An [OpenRouter](https://openrouter.ai) API key

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 4. Create the `.env` file

In the root of the project, create a `.env` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

> Get your free API key at [openrouter.ai/keys](https://openrouter.ai/keys)

### 5. Run the backend

```bash
npm start
# Server runs on http://localhost:5000
```

### 6. Run the frontend

```bash
cd client
npm run dev
# App opens on http://localhost:5173
```

> **Note:** The frontend is currently configured to call the deployed Render backend. For local development, update the API URL in `client/src/App.jsx` to `http://localhost:5000/upload`.

---

## API Reference

### `GET /`

Health check.

**Response:** `Resume Analyzer backend is running`

---

### `POST /upload`

Analyzes a resume PDF.

**Content-Type:** `multipart/form-data`

| Field    | Type   | Required | Description                        |
|----------|--------|----------|------------------------------------|
| `resume` | File   | Yes      | PDF file (max 2 MB)                |
| `jobDesc`| String | No       | Job description text for matching  |

**Success Response (200):**

```json
{
  "message": "Analysis complete",
  "analysis": {
    "score": 85,
    "matchScore": 78,
    "strengths": ["Strong React experience", "..."],
    "weaknesses": ["No TypeScript mentioned", "..."],
    "missingSkills": ["Docker", "..."],
    "missingKeywords": ["CI/CD", "..."]
  }
}
```

**Error Responses:**

| Status | Message                            |
|--------|------------------------------------|
| 400    | No file uploaded                   |
| 400    | Only PDF files are allowed         |
| 400    | File size exceeds 2MB limit        |
| 500    | Failed to process the file. Please try again. |

---

## Deployment

### Backend — Render

1. Push your code to GitHub (`.env` is gitignored — do **not** commit it)
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set the build command: `npm install`
4. Set the start command: `npm start`
5. Add the environment variable in the Render dashboard:
   - Key: `OPENROUTER_API_KEY`
   - Value: your OpenRouter API key

### Frontend — Vercel

1. Import the `client/` folder as a new project on [vercel.com](https://vercel.com)
2. Framework preset: **Vite**
3. No environment variables needed for the frontend

---

## Environment Variables

| Variable           | Description                  | Required |
|--------------------|------------------------------|----------|
| `OPENROUTER_API_KEY` | Your OpenRouter API key    | Yes      |
| `PORT`             | Server port (default: 5000)  | No       |

---

## Known Limitations

- Only text-based PDFs are supported. Scanned image PDFs will return empty text.
- The Render free tier spins down after 15 minutes of inactivity. The first request after a sleep period may take up to 60 seconds.

---

## License

MIT
