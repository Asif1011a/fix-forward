import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, Scale, FileText, Phone, MapPin, Loader2, Bot, User,
  Mic, MicOff, Menu, X, Search, Globe, ChevronRight,
} from 'lucide-react';
import { sendChatMessage, generatePDF, searchDLSA } from './api';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DISCLAIMER_ACCEPTED_KEY = 'nyaybot_disclaimer_accepted';

const EXAMPLE_PROMPTS = [
  'Landlord ne deposit wapas nahi kiya',
  'My employer has not paid my salary for 2 months',
  'I received a defective product online',
  'I want to file an RTI — government office is not responding',
  'Domestic violence — what are my rights?',
  'Caste-based discrimination at workplace',
];

const LANGUAGE_OPTIONS = [
  { value: 'auto', label: '🌐 Auto-detect' },
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'हिंदी (Hindi)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
];

// ---------------------------------------------------------------------------
// Feature 7: Legal Disclaimer Modal (one-time, localStorage)
// ---------------------------------------------------------------------------

function DisclaimerModal({ onAccept }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#fff', borderRadius: '16px', padding: '32px',
          maxWidth: '480px', width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Scale size={32} color="#1a237e" />
          <div>
            <h2 style={{ margin: 0, color: '#1a237e', fontSize: '20px' }}>Welcome to NyayBot</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#757575' }}>AI Legal Assistant for India</p>
          </div>
        </div>

        <p style={{ fontSize: '14px', color: '#424242', lineHeight: '1.6', marginBottom: '16px' }}>
          Before you begin, please note:
        </p>

        <ul style={{ paddingLeft: '20px', margin: '0 0 20px', fontSize: '14px', color: '#424242', lineHeight: '1.8' }}>
          <li>NyayBot provides <strong>legal information</strong>, not legal advice.</li>
          <li>Information may not cover your specific circumstances.</li>
          <li>Always verify with a qualified lawyer or your nearest DLSA.</li>
          <li>For emergencies, call <strong>NALSA at 15100</strong> (free legal aid).</li>
        </ul>

        <button
          onClick={onAccept}
          style={{
            width: '100%', background: '#1a237e', color: '#fff',
            border: 'none', borderRadius: '10px', padding: '14px',
            fontSize: '15px', fontWeight: '700', cursor: 'pointer',
          }}
        >
          I Understand — Get Started 🙏
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// PDF Download Button
// ---------------------------------------------------------------------------

function PDFButton({ applicableLaw, complaintText }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDownload() {
    setLoading(true);
    setError('');
    try {
      const blob = await generatePDF({
        applicable_law: applicableLaw,
        complaint_text: complaintText,
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
          display: 'flex', alignItems: 'center', gap: '6px',
          background: loading ? '#9e9e9e' : '#2e7d32',
          color: '#fff', border: 'none', borderRadius: '8px',
          padding: '8px 14px', fontSize: '13px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: '600', transition: 'background 0.2s',
        }}
      >
        {loading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <FileText size={14} />}
        {loading ? 'Generating PDF…' : 'Download Legal Notice PDF'}
      </button>
      {error && <p style={{ color: '#c62828', fontSize: '12px', marginTop: '6px' }}>{error}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature 4: Structured response renderer
// ---------------------------------------------------------------------------

function StructuredResponse({ data, userMessage }) {
  return (
    <div>
      {/* Applicable Law badge */}
      {data.applicable_law && (
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#e8eaf6', color: '#1a237e',
            borderRadius: '20px', padding: '4px 12px',
            fontSize: '12px', fontWeight: '700',
            marginBottom: '10px', border: '1px solid #c5cae9',
          }}
        >
          <Scale size={12} />
          {data.applicable_law}
        </div>
      )}

      {/* Summary */}
      <p style={{ margin: '0 0 12px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {data.summary}
      </p>

      {/* Next Steps */}
      {data.next_steps && data.next_steps.length > 0 && (
        <div style={{ marginBottom: '12px' }}>
          <p style={{ margin: '0 0 6px', fontWeight: '700', fontSize: '13px', color: '#1a237e' }}>
            📋 Next Steps:
          </p>
          <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.8' }}>
            {data.next_steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Disclaimer */}
      {data.disclaimer && (
        <p style={{ margin: '0 0 12px', fontSize: '11px', color: '#9e9e9e', fontStyle: 'italic' }}>
          ⚠️ {data.disclaimer}
        </p>
      )}

      {/* PDF Download */}
      {data.applicable_law && (
        <PDFButton
          applicableLaw={data.applicable_law}
          complaintText={userMessage}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chat Message
// ---------------------------------------------------------------------------

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div
      style={{
        display: 'flex', gap: '10px', marginBottom: '16px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: isUser ? '#1a237e' : '#e8f5e9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, border: isUser ? 'none' : '1px solid #c8e6c9',
        }}
      >
        {isUser ? <User size={18} color="#fff" /> : <Bot size={18} color="#2e7d32" />}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '75%',
          background: isUser ? '#1a237e' : '#f8f9fa',
          color: isUser ? '#ffffff' : '#212121',
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          padding: '12px 16px', fontSize: '14px', lineHeight: '1.6',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</span>
        ) : message.is_structured ? (
          <StructuredResponse data={message} userMessage={message.userMessage} />
        ) : (
          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{message.content}</span>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature 9: Example Prompt Chips
// ---------------------------------------------------------------------------

function PromptChips({ onSelect }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#757575', textAlign: 'center' }}>
        💡 Try one of these examples:
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onSelect(prompt)}
            style={{
              background: '#e8eaf6', color: '#1a237e',
              border: '1px solid #c5cae9', borderRadius: '20px',
              padding: '6px 14px', fontSize: '13px',
              cursor: 'pointer', transition: 'background 0.15s',
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#c5cae9')}
            onMouseLeave={(e) => (e.target.style.background = '#e8eaf6')}
          >
            <ChevronRight size={12} />
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature 5: DLSA Search (inside Sidebar)
// ---------------------------------------------------------------------------

function DLSASearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function doSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchDLSA(query.trim());
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3
        style={{
          margin: '0 0 10px 0', fontSize: '13px', color: '#ffd600',
          textTransform: 'uppercase', letterSpacing: '0.5px',
        }}
      >
        🏛️ Find Your DLSA
      </h3>

      <div style={{ display: 'flex', gap: '4px' }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          placeholder="Enter district name…"
          style={{
            flex: 1, background: '#283593', color: '#fff',
            border: '1px solid #3949ab', borderRadius: '8px',
            padding: '7px 10px', fontSize: '12px', outline: 'none',
          }}
        />
        <button
          onClick={doSearch}
          disabled={loading}
          style={{
            background: '#ffd600', border: 'none', borderRadius: '8px',
            padding: '7px 10px', cursor: 'pointer', display: 'flex',
            alignItems: 'center',
          }}
        >
          {loading ? <Loader2 size={14} color="#1a237e" style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={14} color="#1a237e" />}
        </button>
      </div>

      {searched && results.length === 0 && !loading && (
        <p style={{ fontSize: '12px', color: '#9fa8da', marginTop: '8px' }}>
          No DLSA found. Try a different district name.
        </p>
      )}

      <div style={{ marginTop: '8px', maxHeight: '180px', overflowY: 'auto' }}>
        {results.map((r) => (
          <div
            key={`${r.district}-${r.state}`}
            style={{
              background: '#283593', borderRadius: '8px', padding: '10px',
              marginBottom: '6px', fontSize: '12px',
            }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: '700', color: '#fff', fontSize: '13px' }}>
              {r.district}, {r.state}
            </p>
            <p style={{ margin: '0 0 2px', color: '#c5cae9' }}>{r.address}</p>
            <p style={{ margin: '0 0 2px', color: '#ffd600' }}>📞 {r.phone}</p>
            {r.email && (
              <p style={{ margin: 0, color: '#82b1ff', fontSize: '11px' }}>✉ {r.email}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature 3: Language Selector
// ---------------------------------------------------------------------------

function LanguageSelector({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <Globe size={14} color="#9fa8da" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: '#283593', color: '#fff',
          border: '1px solid #3949ab', borderRadius: '6px',
          padding: '4px 8px', fontSize: '12px', cursor: 'pointer',
          outline: 'none',
        }}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feature 8: Sidebar (mobile-aware)
// ---------------------------------------------------------------------------

function Sidebar({ isOpen, onClose, isMobile, language, onLanguageChange }) {
  if (isMobile && !isOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.5)',
          }}
        />
      )}

      <aside
        style={{
          width: '270px', flexShrink: 0,
          background: '#1a237e', color: '#fff',
          display: 'flex', flexDirection: 'column',
          padding: '20px 16px', gap: '16px', overflowY: 'auto',
          ...(isMobile
            ? {
                position: 'fixed', top: 0, left: 0, bottom: 0,
                zIndex: 100, boxShadow: '4px 0 20px rgba(0,0,0,0.4)',
              }
            : {}),
        }}
      >
        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            style={{
              alignSelf: 'flex-end', background: 'transparent',
              border: 'none', cursor: 'pointer', padding: '4px',
            }}
          >
            <X size={20} color="#fff" />
          </button>
        )}

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Scale size={28} color="#ffd600" />
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#fff' }}>NyayBot</h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#c5cae9' }}>AI Legal Assistant for India</p>
          </div>
        </div>

        <hr style={{ borderColor: '#3949ab', margin: '0' }} />

        {/* About */}
        <p style={{ fontSize: '13px', color: '#c5cae9', lineHeight: '1.6', margin: 0 }}>
          Describe your legal problem in <strong>Hindi, Tamil, or English</strong>.
          NyayBot identifies the applicable Indian law and explains your rights for free.
        </p>

        <hr style={{ borderColor: '#3949ab', margin: '0' }} />

        {/* Feature 3: Language Selector */}
        <div>
          <h3
            style={{
              margin: '0 0 8px 0', fontSize: '13px', color: '#ffd600',
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}
          >
            Response Language
          </h3>
          <LanguageSelector value={language} onChange={onLanguageChange} />
        </div>

        <hr style={{ borderColor: '#3949ab', margin: '0' }} />

        {/* Feature 5: DLSA Search */}
        <DLSASearch />

        <hr style={{ borderColor: '#3949ab', margin: '0' }} />

        {/* Free Legal Aid */}
        <div>
          <h3
            style={{
              margin: '0 0 10px 0', fontSize: '13px', color: '#ffd600',
              textTransform: 'uppercase', letterSpacing: '0.5px',
            }}
          >
            Free Legal Aid
          </h3>

          <div
            style={{
              background: '#283593', borderRadius: '10px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px',
            }}
          >
            <Phone size={18} color="#ffd600" />
            <div>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '16px', color: '#fff' }}>15100</p>
              <p style={{ margin: 0, fontSize: '11px', color: '#c5cae9' }}>NALSA Free Legal Aid Helpline</p>
            </div>
          </div>

          <div
            style={{
              background: '#283593', borderRadius: '10px', padding: '12px',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            <MapPin size={18} color="#ffd600" />
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '13px', color: '#fff' }}>Find your nearest DLSA</p>
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
    </>
  );
}

// ---------------------------------------------------------------------------
// Feature 1: Voice Input Button
// ---------------------------------------------------------------------------

function VoiceButton({ onResult, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
  }, [onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  if (!isSupported) return null;

  return (
    <button
      onClick={isListening ? stopListening : startListening}
      disabled={disabled}
      title={isListening ? 'Stop listening' : 'Speak your question (Voice input)'}
      style={{
        background: isListening ? '#c62828' : '#3949ab',
        border: 'none', borderRadius: '12px',
        padding: '12px 14px', cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.2s', flexShrink: 0,
        animation: isListening ? 'pulse 1s ease-in-out infinite' : 'none',
      }}
    >
      {isListening
        ? <MicOff size={18} color="#fff" />
        : <Mic size={18} color="#fff" />}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Main App
// ---------------------------------------------------------------------------

export default function App() {
  // Feature 7: Disclaimer modal
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(
    () => localStorage.getItem(DISCLAIMER_ACCEPTED_KEY) === 'true'
  );

  // Messages (Feature 2: history tracked here)
  const [messages, setMessages] = useState([
    {
      id: 0,
      role: 'bot',
      content:
        'Namaste! 🙏 I am NyayBot, your free AI legal assistant for India.\n\nDescribe your legal problem in Hindi, English, or Tamil — for example:\n• "Landlord ne deposit wapas nahi kiya"\n• "My employer has not paid my salary for 2 months"\n• "I received a defective product online"\n\nI will identify the applicable Indian law and explain your rights in simple language.',
      is_structured: false,
    },
  ]);

  const nextId = useRef(1);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Feature 3: Language selector
  const [language, setLanguage] = useState('auto');

  // Feature 8: Mobile sidebar state
  const [windowWidth, setWindowWidth] = useState(() => window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function acceptDisclaimer() {
    localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, 'true');
    setDisclaimerAccepted(true);
  }

  // Feature 2: Build history for the API call
  function buildHistory() {
    return messages.slice(1).map((m) => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      // Use summary (structured) or content (plain) as the history text
      content: m.role === 'bot' ? (m.summary || m.content) : m.content,
    }));
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsgId = nextId.current++;
    setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: text }]);
    setLoading(true);

    try {
      // buildHistory() returns all previous turns (React state not yet updated
      // with the current message, so no need to manually add/remove it)
      const history = buildHistory();

      const data = await sendChatMessage(text, history, language);

      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: 'bot',
          content: data.reply || data.summary,
          is_structured: data.is_structured,
          applicable_law: data.applicable_law,
          summary: data.summary,
          next_steps: data.next_steps,
          disclaimer: data.disclaimer,
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
            '❌ Sorry, I could not connect to the server. Please make sure the NyayBot backend is running (port 8000).',
          is_structured: false,
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

  // Feature 9: Select an example prompt
  function handlePromptSelect(prompt) {
    setInput(prompt);
  }

  // Feature 1: Voice result handler
  function handleVoiceResult(transcript) {
    setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
  }

  // True if no human messages yet (only the greeting)
  const onlyGreeting = messages.length === 1;

  return (
    <>
      {/* Feature 7: Disclaimer Modal */}
      {!disclaimerAccepted && <DisclaimerModal onAccept={acceptDisclaimer} />}

      <div
        style={{
          display: 'flex', height: '100vh',
          fontFamily: "'Segoe UI', system-ui, sans-serif",
          background: '#f5f5f5', overflow: 'hidden',
        }}
      >
        {/* Feature 8: Sidebar (desktop always visible, mobile as overlay) */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Header */}
          <header
            style={{
              background: '#fff', borderBottom: '1px solid #e0e0e0',
              padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px',
            }}
          >
            {/* Feature 8: Hamburger on mobile */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  background: 'transparent', border: 'none',
                  cursor: 'pointer', padding: '4px', display: 'flex',
                }}
              >
                <Menu size={22} color="#1a237e" />
              </button>
            )}
            <Scale size={20} color="#1a237e" />
            <span style={{ fontWeight: '600', color: '#1a237e', fontSize: '15px', flex: 1 }}>
              NyayBot — Ask your legal question
            </span>
          </header>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>

            {/* Feature 9: Example prompt chips (shown when chat is empty) */}
            {onlyGreeting && !loading && (
              <>
                <ChatMessage message={messages[0]} />
                <PromptChips onSelect={handlePromptSelect} />
              </>
            )}

            {!onlyGreeting && messages.map((msg) => (
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
              background: '#fff', borderTop: '1px solid #e0e0e0',
              padding: '12px 16px', display: 'flex', gap: '8px', alignItems: 'flex-end',
            }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your legal problem in Hindi, English, or Tamil…"
              rows={2}
              style={{
                flex: 1, border: '1.5px solid #c5cae9', borderRadius: '12px',
                padding: '10px 14px', fontSize: '14px', resize: 'none',
                outline: 'none', fontFamily: 'inherit', lineHeight: '1.5',
                color: '#212121', transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#1a237e')}
              onBlur={(e) => (e.target.style.borderColor = '#c5cae9')}
            />

            {/* Feature 1: Voice input button */}
            <VoiceButton onResult={handleVoiceResult} disabled={loading} />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              title="Send message"
              style={{
                background: loading || !input.trim() ? '#9e9e9e' : '#1a237e',
                border: 'none', borderRadius: '12px', padding: '12px 16px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <Send size={18} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #c5cae9; border-radius: 3px; }
        select option { background: #1a237e; }
      `}</style>
    </>
  );
}

