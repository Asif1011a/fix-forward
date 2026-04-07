import { useState, useRef, useEffect } from 'react';
import { Send, Scale, FileText, Phone, MapPin, Loader2, Bot, User } from 'lucide-react';
import { sendChatMessage, generatePDF } from './api';

// ---------------------------------------------------------------------------
// Helper: extract a likely law name from the AI's reply for the PDF
// ---------------------------------------------------------------------------
function extractLaw(text) {
  const patterns = [
    /Consumer Protection Act[\s\d]*/i,
    /Bharatiya Nyaya Sanhita[\s\d]*/i,
    /BNS[\s\d]*/i,
    /Payment of Wages Act[\s\d]*/i,
    /Domestic Violence Act[\s\d]*/i,
    /Protection of Women from Domestic Violence Act[\s\d]*/i,
    /RTI Act[\s\d]*/i,
    /Right to Information Act[\s\d]*/i,
    /Indian Contract Act[\s\d]*/i,
    /Transfer of Property Act[\s\d]*/i,
    /SC\/ST[\s\w()]*/i,
    /Prevention of Atrocities Act[\s\d]*/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[0].trim();
  }
  return 'Applicable Indian Law (as identified by NyayBot)';
}

// ---------------------------------------------------------------------------
// ChatMessage component
// ---------------------------------------------------------------------------
function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '16px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: isUser ? '#1a237e' : '#e8f5e9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: isUser ? 'none' : '1px solid #c8e6c9',
        }}
      >
        {isUser ? (
          <User size={18} color="#fff" />
        ) : (
          <Bot size={18} color="#2e7d32" />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '75%',
          background: isUser ? '#1a237e' : '#f8f9fa',
          color: isUser ? '#ffffff' : '#212121',
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          padding: '12px 16px',
          fontSize: '14px',
          lineHeight: '1.6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {message.content}

        {/* PDF download button — shown only on bot messages with law data */}
        {!isUser && message.showPDFButton && (
          <PDFButton reply={message.content} userMessage={message.userMessage} />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PDFButton component
// ---------------------------------------------------------------------------
function PDFButton({ reply, userMessage }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setLoading(true);
    setError('');
    try {
      const blob = await generatePDF({
        applicable_law: extractLaw(reply),
        complaint_text: userMessage,
        user_language: 'English',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'NyayBot_Legal_Notice.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Could not generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: '12px' }}>
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: loading ? '#9e9e9e' : '#2e7d32',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 14px',
          fontSize: '13px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600',
          transition: 'background 0.2s',
        }}
      >
        {loading ? (
          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
        ) : (
          <FileText size={14} />
        )}
        {loading ? 'Generating PDF…' : 'Download Legal Notice PDF'}
      </button>
      {error && (
        <p style={{ color: '#c62828', fontSize: '12px', marginTop: '6px' }}>{error}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar component
// ---------------------------------------------------------------------------
function Sidebar() {
  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        background: '#1a237e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '20px',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Scale size={28} color="#ffd600" />
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#fff' }}>
            NyayBot
          </h1>
          <p style={{ margin: 0, fontSize: '11px', color: '#c5cae9' }}>
            AI Legal Assistant for India
          </p>
        </div>
      </div>

      <hr style={{ borderColor: '#3949ab', margin: '0' }} />

      {/* About */}
      <div>
        <p style={{ fontSize: '13px', color: '#c5cae9', lineHeight: '1.6', margin: 0 }}>
          Describe your legal problem in <strong>Hindi, Tamil, or English</strong>.
          NyayBot identifies the applicable Indian law and explains your rights for free.
        </p>
      </div>

      <hr style={{ borderColor: '#3949ab', margin: '0' }} />

      {/* Free Legal Aid */}
      <div>
        <h3
          style={{
            margin: '0 0 10px 0',
            fontSize: '13px',
            color: '#ffd600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Free Legal Aid
        </h3>

        <div
          style={{
            background: '#283593',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <Phone size={18} color="#ffd600" />
          <div>
            <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#fff' }}>
              15100
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#c5cae9' }}>
              NALSA Free Legal Aid Helpline
            </p>
          </div>
        </div>

        <div
          style={{
            background: '#283593',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <MapPin size={18} color="#ffd600" />
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#fff' }}>
              Find your nearest DLSA
            </p>
            <a
              href="https://nalsa.gov.in/lsams"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#82b1ff', fontSize: '11px' }}
            >
              nalsa.gov.in/lsams →
            </a>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: '#3949ab', margin: '0' }} />

      {/* Disclaimer */}
      <p style={{ fontSize: '11px', color: '#9fa8da', lineHeight: '1.5', margin: 0 }}>
        ⚠️ NyayBot provides legal <em>information</em>, not legal advice. Verify with
        your nearest DLSA or call NALSA at 15100 for your specific case.
      </p>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------
export default function App() {
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'bot',
      content:
        'Namaste! 🙏 I am NyayBot, your free AI legal assistant for India.\n\nDescribe your legal problem in Hindi, English, or Tamil — for example:\n• "Landlord ne deposit wapas nahi kiya"\n• "My employer has not paid my salary for 2 months"\n• "I received a defective product online"\n\nI will identify the applicable Indian law and explain your rights in simple language.',
      showPDFButton: false,
    },
  ]);
  const nextId = useRef(1);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { id: nextId.current++, role: 'user', content: text }]);
    setLoading(true);

    try {
      const reply = await sendChatMessage(text);
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: 'bot',
          content: reply,
          showPDFButton: true,
          userMessage: text,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: 'bot',
          content:
            '❌ Sorry, I could not connect to the server. Please make sure the NyayBot backend is running on http://localhost:8000.',
          showPDFButton: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        background: '#f5f5f5',
        overflow: 'hidden',
      }}
    >
      <Sidebar />

      {/* Chat area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top bar */}
        <header
          style={{
            background: '#fff',
            borderBottom: '1px solid #e0e0e0',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Scale size={20} color="#1a237e" />
          <span style={{ fontWeight: '600', color: '#1a237e', fontSize: '15px' }}>
            NyayBot — Ask your legal question
          </span>
        </header>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
          }}
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#757575' }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontSize: '14px' }}>NyayBot is thinking…</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div
          style={{
            background: '#fff',
            borderTop: '1px solid #e0e0e0',
            padding: '16px 24px',
            display: 'flex',
            gap: '10px',
            alignItems: 'flex-end',
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your legal problem in Hindi, English, or Tamil…"
            rows={2}
            style={{
              flex: 1,
              border: '1.5px solid #c5cae9',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '14px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              lineHeight: '1.5',
              color: '#212121',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#1a237e')}
            onBlur={(e) => (e.target.style.borderColor = '#c5cae9')}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? '#9e9e9e' : '#1a237e',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 16px',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
          >
            <Send size={18} color="#fff" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c5cae9; border-radius: 3px; }
      `}</style>
    </div>
  );
}
