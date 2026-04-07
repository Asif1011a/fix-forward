import json
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama3-70b-8192")

SYSTEM_PROMPT = """You are NyayBot, an expert AI legal assistant specializing in Indian law.
Your role is to help ordinary Indian citizens — including those from low-income backgrounds — understand their legal rights and identify the correct law that applies to their situation.

Core responsibilities:
1. Identify the most relevant Indian law(s) for the user's problem. Focus on:
   - Bharatiya Nyaya Sanhita (BNS) 2023 — the replacement for the Indian Penal Code (IPC), effective July 2024
   - Consumer Protection Act 2019 — for cheating, defective products, online fraud
   - Payment of Wages Act 1936 — for unpaid salary or wage disputes
   - Protection of Women from Domestic Violence Act 2005 — for domestic abuse
   - Right to Information (RTI) Act 2005 — for government non-response
   - Transfer of Property Act / Rent Control Acts — for landlord-tenant disputes
   - Indian Contract Act 1872 — for breach of contract
   - Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act 1989 — for caste-based discrimination
   - Any other applicable Indian central or state legislation

2. Explain the user's rights in simple, plain language. Avoid legal jargon. Write as if you are explaining to a Class 8 student.

3. Provide 3-4 clear, actionable next steps. Always end with: Call NALSA at 15100 for free legal aid.

4. Respond in the same language the user writes in. If they write in Hindi, reply in Hindi. If in English, reply in English.

CRITICAL INSTRUCTION: You MUST respond with ONLY valid JSON — no markdown, no code fences, no extra text.
Use this exact format:
{
  "applicable_law": "Name of the primary Indian law applicable to the problem",
  "summary": "Plain language explanation of the user's rights (2-4 sentences, in the user's language)",
  "next_steps": [
    "First action the user should take",
    "Second action",
    "Third action",
    "Call NALSA at 15100 for free legal aid"
  ],
  "disclaimer": "NyayBot provides legal information, not legal advice. For your specific case, please verify with your nearest District Legal Services Authority (DLSA) or call NALSA at 15100."
}"""


def get_legal_advice(user_message: str, history: list = None, language: str = "auto") -> dict:
    """
    Send a user message (with optional conversation history) to the Groq-hosted LLM
    and return a structured legal advice response.

    Returns a dict with keys: applicable_law, summary, next_steps, disclaimer,
    is_structured, reply.

    Uses the standard OpenAI Python client pointed at Groq's OpenAI-compatible endpoint.
    To switch providers, simply change GROQ_API_KEY and the base_url below.
    """
    if not GROQ_API_KEY:
        raise ValueError(
            "GROQ_API_KEY is not set. Please copy backend/.env.example to backend/.env "
            "and add your Groq API key from https://console.groq.com"
        )

    client = OpenAI(
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    # Append conversation history for multi-turn context
    if history:
        for turn in history:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

    # Append language preference note if explicitly set
    content = user_message
    if language and language.lower() not in ("auto", ""):
        content = f"{user_message}\n\n[Please respond in {language}.]"
    messages.append({"role": "user", "content": content})

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=0.3,
        max_tokens=1024,
    )

    raw = response.choices[0].message.content.strip()

    # Attempt to parse JSON — strip accidental markdown fences if present
    cleaned = raw
    if cleaned.startswith("```"):
        parts = cleaned.split("```")
        # parts[1] is the content between first pair of fences
        if len(parts) >= 2:
            cleaned = parts[1]
            if cleaned.lower().startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        result = json.loads(cleaned)
        return {
            "reply": result.get("summary", raw),
            "applicable_law": result.get("applicable_law", ""),
            "summary": result.get("summary", raw),
            "next_steps": result.get("next_steps", []),
            "disclaimer": result.get("disclaimer", ""),
            "is_structured": True,
        }
    except (json.JSONDecodeError, AttributeError):
        # Graceful fallback to plain text
        return {
            "reply": raw,
            "applicable_law": "",
            "summary": raw,
            "next_steps": [],
            "disclaimer": (
                "NyayBot provides legal information, not legal advice. "
                "For your specific case, please verify with your nearest DLSA or call NALSA at 15100."
            ),
            "is_structured": False,
        }
