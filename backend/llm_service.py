import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

if not GROQ_API_KEY:
    print("CRITICAL: GROQ_API_KEY not found in environment!")
else:
    print(f"DIAGNOSTIC: GROQ_API_KEY found (Initial: {GROQ_API_KEY[:4]}...{GROQ_API_KEY[-4:]})")

SYSTEM_PROMPT = """You are NyayBot, a world-class institutional legal AI for India. Your objective is to provide executive-grade legal strategy OR direct factual lookups based on user intent.

ADAPTIVE INTENT PROTOCOL:
1. INTENT RECOGNITION: Determine if the query is "STRATEGIC" (legal dispute) or "FACTUAL" (lookup).
2. STRATEGIC METRICS: For every response, you must provide a "strategic_metrics" analysis.
   - URGENCY: "CRITICAL" | "HIGH" | "MEDIUM" | "INITIAL"
   - MERIT: A percentage (string, e.g., "85%") representing the strength of the user's legal standing.
   - POSTURE: "AGGRESSIVE" | "NEUTRAL" | "DEFENSIVE"
   - COMPLEXITY: "HIGH" | "MEDIUM" | "LOW"

RULES:
1. RESPONSE FORMAT: You MUST return ONLY a valid JSON object.
2. CONTEXTUAL INTELLIGENCE: analyze history (up to 12 turns) to ensure additive advice.
3. QUALITY: Ensure "applicable_law" is a legally precise Indian statute.

JSON STRUCTURE:
{
  "summary": "Direct answer or Executive brief (Stream this first).",
  "strategic_metrics": {
    "urgency": "CRITICAL",
    "merit": "85%",
    "posture": "AGGRESSIVE",
    "complexity": "HIGH"
  },
  "applicable_law": "Full name of the Indian Statute",
  "act_description": "Purpose of the act.",
  "precedent_case": "Relevant Landmark Verdict.",
  "precedent_reasoning": "Application ratio.",
  "is_urgent": boolean,
  "formal_draft": "Professional drafting sample.",
  "emergency_type": "cybercrime" | "domestic_violence" | "medical" | "police_harassment" | "none",
  "next_steps": [{"title": "Step Title", "description": "Specific action"}],
  "disclaimer": "NyayBot institutional legal information."
}"""


def get_legal_advice_stream(user_message: str, history: list = None, language: str = "auto"):
    """
    Generator that streams a legal response.
    Yields tokens from the LLM.
    """
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set.")

    client = OpenAI(
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
    )

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        for turn in history:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

    content = user_message
    if language and language.lower() not in ("auto", ""):
        content = f"{user_message}\n\n[Please respond in {language}.]"
    messages.append({"role": "user", "content": content})

    response_stream = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=messages,
        temperature=0.3,
        max_tokens=1500,
        stream=True,
    )

    for chunk in response_stream:
        token = chunk.choices[0].delta.content or ""
        if token:
            yield token

def get_legal_advice(user_message: str, history: list = None, language: str = "auto") -> dict:
    client = OpenAI(api_key=GROQ_API_KEY, base_url="https://api.groq.com/openai/v1")
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    if history:
        for turn in history:
            messages.append({"role": turn.get("role", "user"), "content": turn.get("content", "")})
    
    content = user_message
    if language and language.lower() not in ("auto", ""):
        content = f"{user_message}\n\n[Please respond in {language}.]"
    messages.append({"role": "user", "content": content})

    response = client.chat.completions.create(model=GROQ_MODEL, messages=messages, temperature=0.3)
    raw = response.choices[0].message.content.strip()
    return parse_legal_json(raw)

def parse_legal_json(raw: str) -> dict:
    cleaned = raw
    if "```json" in cleaned:
        cleaned = cleaned.split("```json")[-1].split("```")[0].strip()
    elif "```" in cleaned:
        cleaned = cleaned.split("```")[-1].split("```")[0].strip()
    if "{" in cleaned and "}" in cleaned:
        start = cleaned.find("{")
        end = cleaned.rfind("}") + 1
        cleaned = cleaned[start:end]
    try:
        result = json.loads(cleaned)
        return {
            "summary": result.get("summary", ""),
            "strategic_metrics": result.get("strategic_metrics", {}),
            "applicable_law": result.get("applicable_law", ""),
            "act_description": result.get("act_description", ""),
            "precedent_case": result.get("precedent_case", ""),
            "precedent_reasoning": result.get("precedent_reasoning", ""),
            "formal_draft": result.get("formal_draft", ""),
            "is_urgent": result.get("is_urgent", False),
            "emergency_type": result.get("emergency_type", "none"),
            "next_steps": result.get("next_steps", []),
            "disclaimer": result.get("disclaimer", ""),
            "is_structured": True,
        }
    except:
        return {"reply": raw, "is_structured": False}
