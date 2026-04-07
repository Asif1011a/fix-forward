# ⚖️ NyayBot — AI Legal Assistant for India

NyayBot is an AI-powered legal assistant built for ordinary Indians who cannot afford a lawyer. It helps identify applicable Indian laws, explains user rights in plain language, generates ready-to-send legal notices or complaint drafts, and locates the nearest free legal aid centre.

> **Disclaimer:** NyayBot provides legal *information*, not legal advice. Always verify with your nearest District Legal Services Authority (DLSA) or call NALSA at **15100**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python |
| AI Provider | [Groq](https://console.groq.com) (Llama 3 70B via OpenAI-compatible API) |
| PDF Generation | ReportLab |
| Frontend | React 18 + Vite |

---

## Project Structure

```
fix-forward/
├── backend/
│   ├── main.py            # FastAPI app (CORS + endpoints)
│   ├── llm_service.py     # Groq / OpenAI-compatible LLM helper
│   ├── pdf_generator.py   # ReportLab legal notice PDF generator
│   ├── requirements.txt
│   └── .env.example       # Copy to .env and add your API key
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx        # Chat UI with PDF download button
        ├── api.js         # Axios helpers for /api/chat and /api/generate-pdf
        └── index.css
```

---

## Quick Start

### 1. Get a Free Groq API Key

1. Go to [https://console.groq.com](https://console.groq.com) and sign up (free).
2. Create an API key under **API Keys**.

### 2. Configure the Backend

```bash
cd backend

# Copy the example env file and add your key
cp .env.example .env
# Open .env and replace 'your_groq_api_key_here' with your actual key
```

### 3. Start the Backend (FastAPI)

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**.  
Interactive API docs: **http://localhost:8000/docs**

### 4. Start the Frontend (React + Vite)

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

---

## API Endpoints

### `POST /api/chat`
Send a legal question and get advice back.

**Request body:**
```json
{ "message": "My landlord is not returning my security deposit." }
```

**Response:**
```json
{ "reply": "Based on your situation, the applicable law is..." }
```

### `POST /api/generate-pdf`
Generate a formatted Legal Notice PDF.

**Request body:**
```json
{
  "applicable_law": "Consumer Protection Act 2019",
  "complaint_text": "I received a defective product...",
  "user_language": "English",
  "complainant_name": "Rahul Sharma",
  "respondent_name": "XYZ Online Store",
  "complainant_address": "123 MG Road, Bangalore",
  "respondent_address": "456 Commercial St, Mumbai"
}
```

**Response:** PDF file download (`NyayBot_Legal_Notice.pdf`)

---

## Switching AI Providers

NyayBot uses the standard `openai` Python package, so you can switch providers by changing just two environment variables in your `.env`:

| Provider | `GROQ_API_KEY` value | `base_url` in `llm_service.py` |
|----------|---------------------|-------------------------------|
| **Groq** (default) | Your Groq key | `https://api.groq.com/openai/v1` |
| **OpenAI** | Your OpenAI key | `https://api.openai.com/v1` |
| **Ollama** (local) | `ollama` | `http://localhost:11434/v1` |

---

## Free Legal Aid Resources

- 📞 **NALSA Helpline:** 15100 (Free legal aid for all Indian citizens)
- 🗺️ **Find your nearest DLSA:** [nalsa.gov.in/lsams](https://nalsa.gov.in/lsams)