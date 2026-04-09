from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from typing import List, Optional

from llm_service import get_legal_advice
from pdf_generator import generate_legal_notice_pdf
from dlsa_data import search_dlsa

app = FastAPI(
    title="NyayBot API",
    description="AI-powered legal assistant backend for India",
    version="0.2.0",
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

class HistoryItem(BaseModel):
    role: str   # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: List[HistoryItem] = []
    language: str = "auto"


class ChatResponse(BaseModel):
    reply: str
    applicable_law: str = ""
    act_description: str = ""
    precedent_case: str = ""
    precedent_reasoning: str = ""
    summary: str = ""
    formal_draft: str = ""
    is_urgent: bool = False
    emergency_type: str = "none"
    next_steps: List[str] = []
    disclaimer: str = ""
    is_structured: bool = False


class GeneratePDFRequest(BaseModel):
    applicable_law: str
    complaint_text: str
    user_language: str = "English"
    complainant_name: str = ""
    respondent_name: str = ""
    complainant_address: str = ""
    respondent_address: str = ""
    document_type: str = "notice"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/")
def root():
    return {"message": "NyayBot API is running. Visit /docs for the interactive API docs."}


from fastapi.responses import Response, JSONResponse, StreamingResponse

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Returns a StreamingResponse of legal advice tokens.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    history = [{"role": h.role, "content": h.content} for h in request.history]

    from llm_service import get_legal_advice_stream

    def stream_generator():
        try:
            for chunk in get_legal_advice_stream(
                user_message=request.message,
                history=history,
                language=request.language,
            ):
                yield chunk
        except Exception as e:
            yield f"Error: {str(e)}"

    return StreamingResponse(stream_generator(), media_type="text/event-stream")


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
            document_type=request.document_type,
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


@app.get("/api/dlsa")
def dlsa_search(q: Optional[str] = Query(default="", description="District or state name to search")):
    """
    Search for the nearest District Legal Services Authority (DLSA).
    Returns matching entries from a static list covering 30+ districts across India.
    If no query is provided, returns the first 10 entries.
    """
    results = search_dlsa(q or "")
    return JSONResponse(content={"results": results, "count": len(results)})


@app.post("/api/webhook/whatsapp")
async def whatsapp_webhook(request_body: dict = None):
    """
    Placeholder Twilio WhatsApp webhook endpoint.
    In production, connect this to a Twilio WhatsApp number and process
    incoming messages by calling get_legal_advice() and replying via Twilio's
    Messaging API.

    Expected Twilio POST fields: Body (message text), From (sender number), To (NyayBot number).
    Returns a TwiML XML response.
    """
    # Placeholder TwiML response — replace with real Twilio integration
    twiml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        "<Response>"
        "<Message>Namaste! NyayBot WhatsApp integration is coming soon. "
        "For now, please use our web app or call NALSA at 15100.</Message>"
        "</Response>"
    )
    return Response(content=twiml, media_type="application/xml")
