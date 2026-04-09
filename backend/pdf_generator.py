import io
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT

def generate_legal_notice_pdf(
    document_type: str,
    applicable_law: str,
    complaint_text: str,
    user_language: str = "English",
    complainant_name: str = "Complainant",
    respondent_name: str = "Respondent",
    complainant_address: str = "",
    respondent_address: str = "",
) -> bytes:
    """
    Generate an authentic Indian Legal Notice PDF with premium color accents and margins.
    """
    buffer = io.BytesIO()

    # Enhanced margins for a "premium" document feel
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=3.0 * cm,
        leftMargin=3.0 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2.0 * cm,
    )

    styles = getSampleStyleSheet()

    # --- Premium Color Palette ---
    brand_color = colors.HexColor("#0f172a") # Slate 900
    accent_color = colors.HexColor("#4338ca") # Deep Indigo
    subtle_bg = colors.HexColor("#f8fafc") # Very light slate
    muted_color = colors.HexColor("#64748b")
    border_color = colors.HexColor("#cbd5e1")

    # --- Styles ---
    title_style = ParagraphStyle(
        "NoticeTitle",
        parent=styles["Heading1"],
        fontSize=20,
        textColor=accent_color,
        alignment=TA_CENTER,
        spaceAfter=25,
        fontName="Helvetica-Bold",
        textTransform="uppercase",
    )
    
    header_right_style = ParagraphStyle(
        "HeaderRight",
        parent=styles["Normal"],
        fontSize=10,
        alignment=TA_RIGHT,
        fontName="Helvetica-Bold",
        textColor=muted_color,
    )

    header_left_style = ParagraphStyle(
        "HeaderLeft",
        parent=styles["Normal"],
        fontSize=10,
        alignment=TA_LEFT,
        fontName="Helvetica-Bold",
        textColor=accent_color,
        spaceAfter=4,
        textTransform="uppercase",
    )

    party_style = ParagraphStyle(
        "PartyText",
        parent=styles["Normal"],
        fontSize=11,
        leading=16,
        fontName="Helvetica",
        textColor=brand_color
    )

    body_style = ParagraphStyle(
        "BodyText",
        parent=styles["Normal"],
        fontSize=11,
        leading=18,
        alignment=TA_JUSTIFY,
        spaceAfter=14,
        fontName="Helvetica",
        textColor=brand_color
    )

    subject_style = ParagraphStyle(
        "SubjectText",
        parent=styles["Normal"],
        fontSize=12,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceBefore=15,
        spaceAfter=15,
        fontName="Helvetica-Bold",
        textColor=accent_color,
        leftIndent=1.5 * cm,
        rightIndent=1.5 * cm
    )

    disclaimer_style = ParagraphStyle(
        "Disclaimer",
        parent=styles["Normal"],
        fontSize=8,
        textColor=muted_color,
        alignment=TA_CENTER,
        leading=12,
    )

    # --- Dynamic Document Attributes ---
    if document_type == "fir":
        title_text = "FIRST INFORMATION REPORT (FIR)"
        subject_text = f"SUB: INFORMATION REGARDING OFFENSE UNDER {applicable_law.upper()}"
        intro_text = "To the Station House Officer (SHO),"
        action_text = "3. I sincerely request you to register an FIR immediately, conduct a thorough investigation, and take strict legal action against the Respondent/Accused."
    elif document_type == "complaint":
        title_text = "FORMAL CONSUMER / CIVIL COMPLAINT"
        subject_text = f"SUB: FORMAL COMPLAINT UNDER {applicable_law.upper()}"
        intro_text = "To the Respected Authority / Commission,"
        action_text = "3. I humbly pray for immediate redressal, compensation for sustained harassment, and strict action against the Respondent as per the law."
    else:
        title_text = "LEGAL NOTICE"
        subject_text = f"SUB: LEGAL NOTICE IN RESPECT OF GRIEVANCES UNDER {applicable_law.upper()}"
        intro_text = "Sir/Madam,\nUnder instructions from and on behalf of myself (hereinafter referred to as the 'Complainant'), I hereby serve upon you the following Notice:"
        action_text = "3. I hereby call upon you to redress the aforementioned grievance, comply with the demands, and compensate for the harassment within 15 days of the receipt of this Notice, failing which I shall be constrained to initiate strict proceedings against you."

    # --- Build document elements ---
    elements = []

    # 1. Dispatch Mode & Date
    mode_table = Table([
        [Paragraph(f"BY REGISTERED POST A.D. / SPEED POST\n<b>Document: {title_text}</b>", header_left_style), 
         Paragraph(f"Dated: {datetime.now().strftime('%d-%m-%Y')}", header_right_style)]
    ], colWidths=[doc.width / 2, doc.width / 2])
    mode_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 15),
    ]))
    elements.append(mode_table)

    # 2. Main Title
    elements.append(Paragraph(title_text, title_style))

    # 3. Addresses (Premium Highlight Box)
    addr_table_data = [
        [
            Paragraph("<b>TO: (RESPONDENT)</b>", header_left_style),
            Paragraph("<b>FROM: (COMPLAINANT)</b>", header_left_style),
        ],
        [
            Paragraph(f"<b>{respondent_name or '—'}</b><br/>{respondent_address.replace(', ', '<br/>') or '—'}", party_style),
            Paragraph(f"<b>{complainant_name or '—'}</b><br/>{complainant_address.replace(', ', '<br/>') or '—'}", party_style),
        ]
    ]
    
    addr_table = Table(addr_table_data, colWidths=[doc.width / 2.05, doc.width / 2.05])
    addr_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (-1, -1), subtle_bg),
        ("TOPPADDING", (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING", (0, 0), (0, -1), 20),
        ("RIGHTPADDING", (0, 0), (0, -1), 10),
        ("LEFTPADDING", (1, 0), (1, -1), 20),
        ("RIGHTPADDING", (1, 0), (1, -1), 10),
        ("LINEBELOW", (0, 0), (-1, 0), 1, border_color),
        ("OUTLINE", (0, 0), (-1, -1), 0.5, border_color),
    ]))
    elements.append(addr_table)
    elements.append(Spacer(1, 1 * cm))

    # 4. Subject Block
    elements.append(HRFlowable(width="100%", thickness=0.5, color=border_color))
    elements.append(Paragraph(f"<b>{subject_text}</b>", subject_style))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=border_color))
    elements.append(Spacer(1, 0.8 * cm))

    # 5. Salutation
    for line in intro_text.split('\n'):
        elements.append(Paragraph(line, body_style))
    elements.append(Spacer(1, 0.4 * cm))

    # 6. Grievance Paragraphs (Numbered, indented)
    elements.append(Paragraph("1. That the Complainant/Victim states the following facts:", body_style))
    for para in complaint_text.split("\n"):
        stripped = para.strip()
        if stripped:
            elements.append(Paragraph(f"<i>{stripped}</i>", ParagraphStyle("BodyIndented", parent=body_style, leftIndent=1 * cm, spaceAfter=8)))

    elements.append(Spacer(1, 0.2 * cm))
    elements.append(Paragraph("2. That your actions / omissions constitute a severe violation of the Complainant's rights as protected under the aforementioned legislations.", body_style))

    # 7. Action / Ultimatum Clause
    ultimatum_para = ParagraphStyle("UltimatumPara", parent=body_style, fontName="Helvetica-Bold", spaceBefore=10)
    elements.append(Paragraph(action_text, ultimatum_para))

    # 8. Closing
    elements.append(Spacer(1, 1.5 * cm))
    closing_data = [
        [
            Paragraph("Yours faithfully,", party_style),
        ],
        [
            Paragraph("___________________________", body_style),
        ],
        [
            Paragraph(f"<b>{complainant_name or 'Complainant'}</b>", party_style),
        ],
    ]
    closing_table = Table(closing_data, colWidths=[doc.width / 2])
    closing_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("ALIGN", (0,0), (-1,-1), "LEFT"),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
    ]))
    elements.append(closing_table)

    # 9. Divider and footer
    elements.append(Spacer(1, 2 * cm))
    elements.append(HRFlowable(width="100%", thickness=0.5, color=border_color))
    elements.append(Spacer(1, 0.3 * cm))
    elements.append(Paragraph(
        "<b>Free Legal Aid Helpline:</b> Call NALSA at <b>15100</b> | Find your nearest DLSA at <b>nalsa.gov.in</b><br/><br/>"
        "<i>NyayBot provides legal information, not legal advice. "
        "Always verify with your nearest District Legal Services Authority (DLSA).</i>",
        disclaimer_style,
    ))

    doc.build(elements)
    return buffer.getvalue()
