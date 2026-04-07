from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel

from llm_service import get_legal_advice
from pdf_generator import generate_legal_notice_pdf

app = FastAPI(
    title="NyayBot API",
    description="AI-powered legal assistant backend for India",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the React dev server (and any origin in development)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


class GeneratePDFRequest(BaseModel):
    applicable_law: str
    complaint_text: str
    user_language: str = "English"
    complainant_name: str = ""
    respondent_name: str = ""
    complainant_address: str = ""
    respondent_address: str = ""


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"message": "NyayBot API is running. Visit /docs for the interactive API docs."}


@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Accept a user message describing their legal problem and return simplified
    legal advice from the LLM (Groq-hosted Llama 3).
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    try:
        reply = get_legal_advice(request.message)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Error communicating with the AI provider: {str(e)}",
        )

    return ChatResponse(reply=reply)


@app.post("/api/generate-pdf")
def generate_pdf(request: GeneratePDFRequest):
    """
    Accept structured information about the legal dispute and return a
    formatted 'Legal Notice / Formal Complaint' PDF file.
    """
    if not request.applicable_law.strip() or not request.complaint_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Both 'applicable_law' and 'complaint_text' are required.",
        )

    try:
        pdf_bytes = generate_legal_notice_pdf(
            applicable_law=request.applicable_law,
            complaint_text=request.complaint_text,
            user_language=request.user_language,
            complainant_name=request.complainant_name,
            respondent_name=request.respondent_name,
            complainant_address=request.complainant_address,
            respondent_address=request.respondent_address,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=NyayBot_Legal_Notice.pdf"
        },
    )
