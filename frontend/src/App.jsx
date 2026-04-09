import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Send, Scale, FileText, Phone, MapPin, Loader2, Bot, User,
  Mic, MicOff, Menu, X, Search, Globe, ChevronRight, Sparkles,
  Moon, Sun, Volume2, VolumeX, AlertTriangle, Archive, Clock, Trash2, Copy,
  CheckCircle2, Info, Gavel, ShieldCheck, History, Plus
} from 'lucide-react';
import { sendChatMessage, streamChatMessage, generatePDF, searchDLSA } from './api';
import { LEGAL_NEWS, getStrategicMetrics } from './legal_news';

// ---------------------------------------------------------------------------
// Constants & Configuration
// ---------------------------------------------------------------------------

const DISCLAIMER_ACCEPTED_KEY = 'nyaybot_disclaimer_accepted_v5';
const SESSIONS_STORAGE_KEY = 'nyaybot_legal_vault_v1';

const EXAMPLE_PROMPTS = [
  { text: 'Landlord deposit issue', icon: <Info size={14} /> },
  { text: 'Salary not paid for 2 months', icon: <FileText size={14} /> },
  { text: 'Defective product online', icon: <ShieldCheck size={14} /> },
  { text: 'Domestic violence rights', icon: <AlertTriangle size={14} /> },
  { text: 'RTI filing procedure', icon: <Scale size={14} /> },
];

const LANGUAGE_OPTIONS = [
  { value: 'auto', label: '🌐 Auto-detect' },
  { value: 'English', label: 'English (India)' },
  { value: 'Hindi', label: 'हिंदी (Hindi)' },
  { value: 'Tamil', label: 'தமிழ் (Tamil)' },
];

// ---------------------------------------------------------------------------
// Premium Shared Components
// ---------------------------------------------------------------------------

/**
 * High-End Disclaimer Modal with backdrop blur
 */
function DisclaimerModal({ onAccept }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(2, 6, 23, 0.5)', backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px', animation: 'fadeIn 0.5s ease'
      }}
    >
      <div
        className="glass-panel"
        style={{
          borderRadius: 'var(--radius-xl)', padding: '48px',
          maxWidth: '540px', width: '100%',
          boxShadow: 'var(--shadow-lg)', animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          border: '1px solid var(--border-strong)',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--primary)', padding: '20px', borderRadius: '24px', boxShadow: 'var(--shadow-primary)' }}>
            <Scale size={40} color="#fff" />
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text)', fontSize: '32px', fontWeight: '800', fontFamily: 'Outfit' }}>NyayBot Enterprise</h2>
            <p style={{ margin: '8px 0 0', fontSize: '16px', color: 'var(--text3)', fontWeight: '500' }}>Indian Legal Intelligence & Strategy Suite</p>
          </div>
        </div>

        <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-strong)', padding: '24px', borderRadius: 'var(--radius)', margin: '0 0 40px', textAlign: 'left' }}>
          <ul style={{ listStyle: 'none', fontSize: '15px', color: 'var(--text2)', lineHeight: '1.8' }}>
            <li style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>Informational guidance based on Indian Statutes.</span>
            </li>
            <li style={{ marginBottom: '12px', display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>Not a substitute for a licensed Legal Practitioner.</span>
            </li>
            <li style={{ display: 'flex', gap: '12px' }}>
              <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>Urgent matters should be reported to <strong>NALSA (15100)</strong>.</span>
            </li>
          </ul>
        </div>

        <button
          onClick={onAccept}
          className="btn-hover focus-ring"
          style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '20px', fontSize: '17px', fontWeight: '700', cursor: 'pointer', boxShadow: 'var(--shadow-primary)' }}
        >
          Initialize Command Center
        </button>
      </div>
    </div>
  );
}

/**
 * Interactive Action Checklist with Vertical Timeline
 */
/**
 * Cinematic Strategy Roadmap with High-Contrast Nodes
 */
function ActionTimeline({ steps }) {
  if (!steps || !Array.isArray(steps) || steps.length === 0) return null;

  return (
    <div style={{ marginTop: '32px', position: 'relative' }}>
      <h3 style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '32px', letterSpacing: '2px' }}>Operational Roadmap</h3>
      <div style={{ position: 'relative' }}>
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;
          const title = typeof step === 'string' ? `Step ${idx + 1}` : step.title;
          const desc = typeof step === 'string' ? step : step.description;

          return (
            <div key={idx} style={{ display: 'flex', gap: '24px', marginBottom: '48px', position: 'relative', animation: `slideUp 0.6s ease forwards`, animationDelay: `${idx * 0.15}s`, opacity: 0 }}>
              {!isLast && <div className="roadmap-connection" />}

              <div className="roadmap-node" style={{ animation: 'glowPulse 3s infinite', animationDelay: `${idx * 0.15}s` }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--primary)' }}>{idx + 1}</span>
              </div>

              <div className="premium-card" style={{ flex: 1, padding: '20px', border: '1px solid var(--border-strong)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
                <p style={{ margin: 0, fontSize: '15px', color: 'var(--text2)', lineHeight: '1.6', fontWeight: '500' }}>{desc}</p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>{idx === 0 ? 'IMMEDIATE' : 'STRATEGIC'}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PDFButton({ onClick, loading }) {
  return (
    <div style={{ marginTop: '24px' }}>
      <button
        onClick={onClick}
        disabled={loading}
        className="btn-hover focus-ring"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '18px 24px', fontSize: '15px', cursor: 'pointer', fontWeight: '700', boxShadow: 'var(--shadow-primary)', width: '100%' }}
      >
        {loading ? <Loader2 size={20} className="spin" /> : <ShieldCheck size={20} />}
        {loading ? 'Processing...' : 'Generate Legal Document'}
      </button>
    </div>
  );
}

function NoticeDetailsModal({ onGenerate, onCancel, docType, setDocType }) {
  const [complainantName, setComplainantName] = useState('');
  const [complainantAddress, setComplainantAddress] = useState('');
  const [respondentName, setRespondentName] = useState('');
  const [respondentAddress, setRespondentAddress] = useState('');

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(2, 6, 23, 0.5)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', maxWidth: '540px', width: '100%', maxHeight: '85vh', overflow: 'hidden', border: '1px solid var(--border-glow)', boxShadow: '0 0 100px rgba(59, 130, 246, 0.2)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '40px 40px 24px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'var(--text)', letterSpacing: '-0.5px', margin: 0 }}>Drafting Prerequisites</h2>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: 'var(--text3)', fontWeight: '500' }}>Define the situational parameters for your legal instrument.</p>
        </div>
        
        <div className="modal-body no-scrollbar" style={{ padding: '24px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Document Protocol</label>
              <PremiumSelect 
                value={docType} 
                onChange={setDocType} 
                options={[
                  { value: 'notice', label: 'Official Legal Notice' },
                  { value: 'fir', label: 'Police FIR Draft' },
                  { value: 'complaint', label: 'Civil Complaint Draft' }
                ]}
                icon={FileText}
              />
            </div>
            
            <InputField label="Claimant Principal Name" value={complainantName} onChange={setComplainantName} placeholder="Full Legal Identity" />
            <InputField label="Claimant Registered Address" value={complainantAddress} onChange={setComplainantAddress} placeholder="City, District, State" />
            <InputField label="Respondent Principal Name" value={respondentName} onChange={setRespondentName} placeholder="Opposing Party Entity" />
            <InputField label="Respondent Known Address" value={respondentAddress} onChange={setRespondentAddress} placeholder="Street, City, Pincode" />
          </div>
        </div>
        
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-solid)', padding: '24px 40px', display: 'flex', gap: '12px' }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '16px', background: 'transparent', color: 'var(--text3)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: '800', cursor: 'pointer' }} className="btn-hover">ABORT DRAFT</button>
          <button onClick={() => onGenerate({ complainantName, complainantAddress, respondentName, respondentAddress })} className="btn-hover" style={{ flex: 2, background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', padding: '16px', fontWeight: '900', fontSize: '14px', boxShadow: 'var(--shadow-primary)', cursor: 'pointer' }}>INITIALIZE GENERATION</button>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>{label}</label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus-ring"
        style={{ width: '100%', padding: '14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text)', outline: 'none', fontSize: '15px' }}
      />
    </div>
  );
}

function PDFPreviewModal({ pdfUrl, onDownload, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(2, 6, 23, 0.7)', backdropFilter: 'blur(24px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div className="glass-panel" style={{ borderRadius: 'var(--radius-xl)', padding: '24px', width: '100%', maxWidth: '900px', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text)' }}>System Draft Preview</h2>
          <button onClick={onCancel} className="btn-hover" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '50%', padding: '8px', cursor: 'pointer' }}><X size={20} color="var(--text)" /></button>
        </div>
        <iframe src={`${pdfUrl}#toolbar=0`} width="100%" height="100%" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }} />
        <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button onClick={onDownload} className="btn-hover" style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '16px 32px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}><Copy size={18} /> Finalize Download</button>
        </div>
      </div>
    </div>
  );
}

function VoiceOutputButton({ text }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const startSpeaking = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    // Prioritize high-quality Indian/Male voices
    const maleVoice = voices.find(v => (v.name.includes('Male') || v.name.includes('David') || v.name.includes('Ravi') || v.name.includes('Google UK English Male')) && (v.lang.startsWith('en'))) || voices.find(v => v.name.includes('Male')) || voices[0];
    if (maleVoice) utterance.voice = maleVoice;
    utterance.lang = 'en-IN';
    utterance.rate = 1.0;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };
  return (
    <button
      onClick={isPlaying ? () => { window.speechSynthesis.cancel(); setIsPlaying(false); } : startSpeaking}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: isPlaying ? 'var(--primary-light)' : 'transparent', color: isPlaying ? 'var(--primary-hover)' : 'var(--text3)', border: '1px solid var(--border)', borderRadius: '24px', padding: '8px 16px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
    >
      {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />} {isPlaying ? 'Stop' : 'Listen'}
    </button>
  );
}

function EmergencyBanner({ type }) {
  const contentMap = {
    cybercrime: { icon: <ShieldCheck size={24} />, title: 'Cybercrime Notification', desc: 'Financial or identity fraud detected. Reporting is vital.', helpline: '1930', url: 'https://cybercrime.gov.in', color: '#1e40af' },
    domestic_violence: { icon: <Scale size={24} />, title: 'Personal Safety Protocol', desc: 'Secure legal and social protections are available immediately.', helpline: '1091 / 181', url: 'tel:1091', color: '#e11d48' },
    medical: { icon: <ShieldCheck size={24} />, title: 'Statutory Health Priority', desc: 'Medical negligence or health risks should be reported.', helpline: '102 / 108', url: 'tel:108', color: '#15803d' },
    police_harassment: { icon: <Gavel size={24} />, title: 'Administrative Misconduct', desc: 'Remedies against police harassment under Article 226/32.', helpline: '154 / 100', url: 'tel:100', color: '#0f172a' }
  };
  const info = contentMap[type] || { icon: <AlertTriangle size={24} />, title: 'Urgent Legal Priority', desc: 'Immediate statutory intervention recommended.', helpline: '15100', url: 'tel:15100', color: '#e11d48' };
  return (
    <div style={{ background: `${info.color}10`, border: `2px solid ${info.color}`, borderRadius: 'var(--radius)', padding: '24px', marginBottom: '32px', display: 'flex', gap: '20px', alignItems: 'flex-start', animation: 'pulse 3s infinite' }}>
      <div style={{ background: info.color, borderRadius: '16px', padding: '12px', color: '#fff', flexShrink: 0, boxShadow: `0 8px 16px ${info.color}40` }}>{info.icon}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 8px', color: info.color, fontSize: '18px', fontWeight: '800', fontFamily: 'Outfit' }}>{info.title}</h4>
        <p style={{ margin: '0 0 16px', color: info.color, fontSize: '15px', lineHeight: '1.6', opacity: 0.9 }}>{info.desc}</p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href={info.url} style={{ background: info.color, color: '#fff', textDecoration: 'none', padding: '10px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> Call {info.helpline}</a>
          <a href="https://nalsa.gov.in" target="_blank" style={{ background: 'transparent', border: `1px solid ${info.color}`, color: info.color, textDecoration: 'none', padding: '10px 20px', borderRadius: '24px', fontSize: '14px', fontWeight: '800' }}>Legal Aid Portal</a>
        </div>
      </div>
    </div>
  );
}

function LocalHelpFinder() {
  const [district, setDistrict] = useState('');
  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '11.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '18px', letterSpacing: '1.2px', fontWeight: '800' }}>Proximity Services</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <MapPin size={16} color="var(--text3)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={district} onChange={e => setDistrict(e.target.value)} placeholder="District Name" style={{ width: '100%', padding: '14px 14px 14px 36px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text)', outline: 'none', fontSize: '14px' }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button onClick={() => window.open(`https://www.google.com/maps/search/Police+Station+near+${district}`, '_blank')} className="btn-hover" style={{ background: 'var(--surface-solid)', border: '1px solid var(--border-strong)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🚔 Police</button>
        <button onClick={() => window.open(`https://www.google.com/maps/search/District+Court+near+${district}`, '_blank')} className="btn-hover" style={{ background: 'var(--surface-solid)', border: '1px solid var(--border-strong)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '13px', cursor: 'pointer', color: 'var(--text2)', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>🏛️ Court</button>
      </div>
    </div>
  );
}

function ECourtsTracker() {
  const [cnr, setCnr] = useState(''); const [copied, setCopied] = useState(false);
  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '11.5px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '18px', letterSpacing: '1.2px', fontWeight: '800' }}>Statutory Tracking</h3>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <input value={cnr} onChange={e => setCnr(e.target.value)} placeholder="CNR Number (ex: TNCH0100...)" style={{ width: '100%', padding: '14px 44px 14px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'var(--text)', fontSize: '14px', fontWeight: '600', outline: 'none' }} />
          <button onClick={() => { navigator.clipboard.writeText(cnr); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: copied ? 'var(--green)' : 'var(--text3)' }}><Copy size={16} /></button>
        </div>
        <button onClick={() => window.open('https://services.ecourts.gov.in/ecourt_india_v7/', '_blank')} className="btn-hover" style={{ background: 'var(--secondary)', color: 'var(--bg-app)', borderRadius: 'var(--radius-sm)', border: 'none', padding: '0 16px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}><ChevronRight size={22} /></button>
      </div>
      <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '12px', lineHeight: '1.4' }}>Use the <strong>eCourts Portal</strong> to verify the live status of your case using the CNR.</p>
    </div>
  );
}

function StructuredResponse({ data }) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease', width: '100%' }}>
      {data.is_urgent && <EmergencyBanner type={data.emergency_type} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ background: 'var(--primary-light)', padding: '10px 20px', borderRadius: '32px', border: '1px solid var(--border-glow)', display: 'flex', gap: '10px', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <Scale size={16} color="var(--primary)" />
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.2px' }}>{data.applicable_law}</span>
        </div>
        <VoiceOutputButton text={data.summary} />
      </div>

      <div style={{ background: 'var(--bg-app)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)', marginBottom: '24px' }}>
        <p style={{ margin: 0, lineHeight: '1.8', color: 'var(--text)', fontSize: '15.5px', whiteSpace: 'pre-wrap', fontWeight: '500' }}>{data.summary}</p>
      </div>

      {data.next_steps && <ActionTimeline steps={data.next_steps} />}

      {data.disclaimer && (
        <div style={{ marginTop: '32px', fontSize: '13px', color: 'var(--text3)', fontStyle: 'italic', background: 'var(--gold-bg)', padding: '16px 20px', borderRadius: '16px', border: '1px solid var(--border-glow)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{data.disclaimer}</span>
        </div>
      )}
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === 'user';
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexDirection: isUser ? 'row-reverse' : 'row', alignItems: 'flex-start', animation: 'messagePop 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isUser ? 'var(--primary)' : 'var(--surface-solid)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: '1px solid var(--border-strong)', boxShadow: 'var(--shadow-sm)' }}>
        {isUser ? <User size={20} color="#fff" /> : <Bot size={20} color="var(--primary)" />}
      </div>
      <div
        className={isUser ? "" : "premium-card"}
        style={{
          maxWidth: '85%',
          background: isUser ? 'var(--primary)' : 'var(--surface-solid)',
          color: isUser ? '#fff' : 'var(--text)',
          borderRadius: isUser ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
          padding: '24px',
          border: '1px solid var(--border-strong)',
          boxShadow: isUser ? 'var(--shadow-primary)' : 'var(--shadow)'
        }}
      >
        {message.is_structured ? (
          <StructuredResponse data={message} />
        ) : (
          <div style={{ fontSize: '15.5px', lineHeight: '1.7', whiteSpace: 'pre-wrap', fontWeight: isUser ? '600' : '500', letterSpacing: '-0.1px' }}>
            {message.content}
            {message.is_streaming && (
              <div style={{ marginTop: '12px' }}>
                <div className="stream-cursor" />
                <TacticalReasoningLoader stepState={message.step || 0} />
              </div>
            )}
          </div>
        )}
        {!isUser && !message.is_structured && (
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            <VoiceOutputButton text={message.content} />
          </div>
        )}
      </div>
    </div>
  );
}

function PromptChips({ onSelect }) {
  return (
    <div style={{ marginTop: '32px', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '640px', margin: '32px auto 0' }}>
      {EXAMPLE_PROMPTS.map(p => (
        <button
          key={p.text}
          onClick={() => onSelect(p.text)}
          className="btn-hover focus-ring"
          style={{ background: 'var(--surface-solid)', border: '1px solid var(--border-strong)', borderRadius: '100px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer', color: 'var(--text2)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: 'var(--shadow-sm)' }}
        >
          <span style={{ color: 'var(--primary)', opacity: 0.8 }}>{p.icon}</span> {p.text}
        </button>
      ))}
    </div>
  );
}

function MetricItem({ label, value }) {
  return (
    <div>
      <p style={{ margin: 0, fontSize: '8px', fontWeight: '900', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: 'var(--text)' }}>{value}</p>
    </div>
  );
}

function PremiumSelect({ value, onChange, options, icon: Icon, openUp = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div 
        className="custom-select-trigger" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ paddingLeft: Icon ? '44px' : '16px' }}
      >
        {Icon && <Icon size={16} color="var(--primary)" style={{ position: 'absolute', left: '16px' }} />}
        <span>{selectedOption.label}</span>
        <ChevronRight size={16} style={{ 
          transform: isOpen ? (openUp ? 'rotate(90deg)' : 'rotate(-90deg)') : (openUp ? 'rotate(-90deg)' : 'rotate(90deg)'), 
          transition: 'transform 0.3s ease',
          opacity: 0.6
        }} />
      </div>

      {isOpen && (
        <div 
          className="custom-select-options" 
          style={{ 
            top: openUp ? 'auto' : 'calc(100% + 8px)', 
            bottom: openUp ? 'calc(100% + 8px)' : 'auto',
            transformOrigin: openUp ? 'bottom' : 'top'
          }}
        >
          {options.map(opt => (
            <div 
              key={opt.value}
              className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LanguageSelector({ value, onChange }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{ margin: 0, fontSize: '10px', fontWeight: '800', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Linguistic Node</p>
      <PremiumSelect 
        value={value} 
        onChange={onChange} 
        options={LANGUAGE_OPTIONS} 
        icon={Globe}
        openUp={true}
      />
    </div>
  );
}

/**
 * Statutory News Ticker - Flagship Feature
 */
function StatutoryTicker() {
  return (
    <div className="ticker-wrap" style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ background: 'var(--primary)', color: '#fff', padding: '8px 16px', fontSize: '10px', fontWeight: '900', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ width: '6px', height: '6px', background: '#fff', borderRadius: '50%', animation: 'blink 1s infinite' }} />
        LIVE BRIEFING
      </div>
      <div className="ticker-content" style={{ flex: 1 }}>
        {[...LEGAL_NEWS, ...LEGAL_NEWS].map((news, i) => (
          <div key={`${news.id}-${i}`} className="ticker-item">
            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '900' }}>{news.tag}</span>
            <span style={{ opacity: 0.5, fontSize: '10px' }}>[{news.source}]</span>
            <span style={{ color: 'var(--text2)', fontSize: '11px' }}>{news.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Tactical Reasoning Loader - High-End Minimalist UI
 */
function TacticalReasoningLoader({ stepState = 0 }) {
  const steps = [
    "NEURAL_BOOT",
    "STATUTORY_SCAN",
    "STRATEGY_SYNTH",
    "EXEC_ENCODE"
  ];
  const labels = [
    "Consulting IPC/CPC Nodes",
    "Analyzing Judicial Precedents",
    "Optimizing Procedural Roadmap",
    "Finalizing Statutory Brief"
  ];

  return (
    <div className="tactical-loader">
      <div className="loader-label">
        <span>{steps[stepState % steps.length]}</span>
        <span style={{ opacity: 0.6 }}>{Math.min(99, Math.floor((stepState / 4) * 100))}%</span>
      </div>
      <div className="loader-bar-bg">
        <div className="loader-bar-fill" />
      </div>
      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text3)', fontWeight: '700', letterSpacing: '0.2px', opacity: 0.8 }}>
        {labels[stepState % labels.length]}...
      </p>
    </div>
  );
}

function VoiceButton({ onResult, disabled }) {
  const [isListening, setIsListening] = useState(false);
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Speech recognition not supported in this browser.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = e => { onResult(e.results[0][0].transcript); setIsListening(false); };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };
  return (
    <button
      onClick={isListening ? null : startListening}
      disabled={disabled}
      className="btn-hover"
      style={{ background: isListening ? 'var(--danger)' : 'var(--primary-light)', border: '1px solid var(--border-strong)', borderRadius: '14px', padding: '12px', cursor: 'pointer', color: isListening ? '#fff' : 'var(--primary)', transition: 'all 0.4s ease', boxShadow: isListening ? '0 0 20px var(--danger)40' : 'none' }}
    >
      {isListening ? <MicOff size={22} className="pulse" /> : <Mic size={22} />}
    </button>
  );
}

export default function App() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => localStorage.getItem(DISCLAIMER_ACCEPTED_KEY) === 'true');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [modalState, setModalState] = useState('closed'); // 'closed', 'details', 'preview'
  const [docType, setDocType] = useState('notice');
  const [language, setLanguage] = useState('auto');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [sessions, setSessions] = useState(() => JSON.parse(localStorage.getItem(SESSIONS_STORAGE_KEY) || '[]'));
  const [activeSessionId, setActiveSessionId] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Persistent Session Sync
  useEffect(() => {
    if (messages.length === 0) return;
    let id = activeSessionId || `session_${Date.now()}`;
    if (!activeSessionId) setActiveSessionId(id);
    
    setSessions(prev => {
      const copy = [...prev];
      const idx = copy.findIndex(s => s.id === id);
      const title = messages.find(m => m.role === 'user')?.content.substring(0, 32) + '...';
      const sessionData = { id, title, messages, timestamp: Date.now() };
      if (idx >= 0) copy[idx] = sessionData;
      else copy.unshift(sessionData);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(copy));
      return copy;
    });
  }, [messages]);

  const handleSend = async (providedText = null) => {
    const userText = providedText || input;
    if (!userText.trim() || loading) return;

    setInput('');
    const requestId = Date.now();
    const newMessage = { id: requestId, role: 'user', content: userText };
    setMessages(prev => [...prev, newMessage]);
    setLoading(true);

    // Add temporary bot message for streaming
    const botId = requestId + 1;
    setMessages(prev => [...prev, { id: botId, role: 'bot', content: '', is_streaming: true, step: 0 }]);

    try {
      const stream = await streamChatMessage(userText, messages.slice(-12), language);
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let stepCounter = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullContent += chunk;
        stepCounter++;

        // Extract only the summary part while streaming
        let displayContent = fullContent;
        const match = fullContent.match(/"summary":\s*"((?:[^"\\]|\\.)*)/);
        if (match && match[1]) {
          displayContent = match[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
        } else if (fullContent.includes('{')) {
          displayContent = "Initializing intelligence nodes...";
        }

        // Update the bot message with current content
        setMessages(prev =>
          prev.map(m => m.id === botId ? { ...m, content: displayContent, step: Math.floor(stepCounter / 5) } : m)
        );
      }

      // Once done, try to parse fullContent as JSON
      let result = { reply: fullContent, summary: fullContent, is_structured: false };
      try {
        // Find JSON boundaries
        const start = fullContent.indexOf('{');
        const end = fullContent.lastIndexOf('}') + 1;
        if (start !== -1 && end !== -1) {
          const jsonStr = fullContent.substring(start, end);
          const data = JSON.parse(jsonStr);
          result = { ...data, reply: data.summary, is_structured: true };
        }
      } catch (e) {
        console.error("JSON Parse Error during stream completion:", e);
      }

      setMessages(prev =>
        prev.map(m => m.id === botId ? { ...m, ...result, id: botId, role: 'bot', userMessage: userText, is_streaming: false } : m)
      );

    } catch (e) {
      console.error("Stream Error:", e);
      setMessages(prev =>
        prev.map(m => m.id === botId ? { ...m, content: 'The legal processing node encountered an error. Please retry.', is_streaming: false } : m)
      );
    } finally {
      setLoading(false);
    }
  };

  const startNewCase = () => {
    setActiveSessionId(null);
    setMessages([]);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    setSessions(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    if (activeSessionId === id) startNewCase();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-app)', color: 'var(--text)' }}>
      <div className="mesh-background" />

      {!disclaimerAccepted && (
        <DisclaimerModal onAccept={() => { localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, 'true'); setDisclaimerAccepted(true); }} />
      )}

      {/* 1. Sidebar - Intelligence Vault */}
      <aside
        style={{
          width: '320px', flexShrink: 0, borderRight: '1px solid var(--border-strong)',
          display: 'flex', flexDirection: 'column',
          background: 'var(--surface)', backdropFilter: 'blur(30px)',
          zIndex: 50
        }}
      >
        <div style={{ padding: '32px 24px', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="no-scrollbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px', boxShadow: 'var(--shadow-primary)' }}>
              <Scale size={22} color="#fff" />
            </div>
            <span style={{ fontWeight: '800', fontSize: '22px', fontFamily: 'Outfit' }}>NyayBot</span>
          </div>

          <button
            onClick={startNewCase}
            className="btn-hover focus-ring"
            style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', padding: '16px', fontWeight: '700', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px' }}
          >
            <Plus size={18} /> New Case Query
          </button>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>History</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sessions.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', opacity: 0.5 }}>
                  <Clock size={24} style={{ marginBottom: '8px', margin: '0 auto' }} />
                  <p style={{ fontSize: '12px' }}>No history yet</p>
                </div>
              )}
              {sessions.map(s => (
                <div
                  key={s.id}
                  onClick={() => { setActiveSessionId(s.id); setMessages(s.messages); }}
                  className="btn-hover"
                  style={{
                    background: activeSessionId === s.id ? 'var(--primary-light)' : 'transparent',
                    padding: '12px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                    border: '1px solid', borderColor: activeSessionId === s.id ? 'var(--primary)' : 'transparent',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                    <FileText size={14} color={activeSessionId === s.id ? 'var(--primary)' : 'var(--text3)'} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: activeSessionId === s.id ? 'var(--text)' : 'var(--text2)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{s.title}</span>
                  </div>
                  <button onClick={(e) => deleteSession(s.id, e)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)', opacity: 0.7 }}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 24px 40px', borderTop: '1px solid var(--border-strong)', background: 'rgba(255,255,255,0.02)' }}>
          {/* Strategic Metrics Dashboard */}
          {messages.length > 0 && (
            <div style={{ marginBottom: '24px', padding: '16px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glow)', animation: 'fadeIn 0.5s ease' }}>
              <h3 style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between' }}>
                Strategic Metrics
                {(loading || messages.some(m => m.is_streaming)) && <span className="blink">SCANNING...</span>}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {(() => {
                  const lastBot = [...messages].reverse().find(m => m.role === 'bot' && m.strategic_metrics);
                  const metrics = lastBot ? lastBot.strategic_metrics : { urgency: '...', merit: '...', posture: '...', complexity: '...' };
                  return (
                    <>
                      <MetricItem label="URGENCY" value={metrics.urgency} />
                      <MetricItem label="LEGAL MERIT" value={metrics.merit} />
                      <MetricItem label="POSTURE" value={metrics.posture} />
                      <MetricItem label="COMPLEXITY" value={metrics.complexity} />
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          <LanguageSelector value={language} onChange={setLanguage} />

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              className="btn-hover"
              style={{ flex: 1, background: 'var(--surface-solid)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-sm)', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: '600', color: 'var(--text2)', fontSize: '13px' }}
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Workspace - Intelligence Canvas */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <StatutoryTicker />
        <header style={{ padding: '24px 40px', borderBottom: '1px solid var(--border-strong)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', backdropFilter: 'blur(10px)', zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h2 style={{ fontSize: '16px', fontWeight: '700' }}>{activeSessionId ? 'Case Intel' : 'Statutory Query'}</h2>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'var(--green)10', color: 'var(--green)', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', border: '1px solid var(--green)30' }}>SECURE NODE</div>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 0', scrollBehavior: 'smooth' }} className="no-scrollbar">
          <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '10vh', animation: 'fadeIn 1s ease' }}>
                <div style={{ display: 'inline-flex', padding: '24px', background: 'var(--surface-solid)', borderRadius: '32px', boxShadow: 'var(--shadow-lg)', marginBottom: '32px', border: '1px solid var(--border-strong)' }}>
                  <Gavel size={64} style={{ color: 'var(--primary)' }} />
                </div>
                <h1 className="shimmer-text" style={{ fontSize: '56px', fontWeight: '900', marginBottom: '16px', letterSpacing: '-0.03em', fontFamily: 'Outfit' }}>NyayBot</h1>
                <p style={{ color: 'var(--text3)', fontSize: '20px', maxWidth: '540px', margin: '0 auto 48px', fontWeight: '600', lineHeight: '1.6' }}>The high-fidelity intelligence hub for Indian legal strategy and statutory analysis.</p>
                <PromptChips onSelect={handleSend} />
              </div>
            )}

            {messages.map(m => <ChatMessage key={m.id} message={m} />)}

            <div ref={chatEndRef} style={{ height: '140px' }} />
          </div>
        </div>

        {/* Improved Command Input Bar */}
        <div style={{ position: 'absolute', bottom: '32px', left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '0 40px', zIndex: 100 }}>
          <div
            className="glass-panel"
            style={{
              borderRadius: '24px', padding: '8px 8px 8px 16px',
              display: 'flex', gap: '16px', width: '100%', maxWidth: '800px',
              boxShadow: 'var(--shadow-lg)', alignItems: 'center',
              border: '1px solid var(--border-strong)'
            }}
          >
            <VoiceButton onResult={setInput} disabled={loading} />
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Describe your legal situation..."
              style={{ flex: 1, background: 'transparent', border: 'none', color: 'var(--text)', outline: 'none', resize: 'none', fontSize: '16px', padding: '12px 0', maxHeight: '120px', minHeight: '24px', fontWeight: '500' }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="btn-hover"
              style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px', boxShadow: 'var(--shadow-primary)' }}
            >
              Analyze <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* 3. Right Action Center - Decision Context */}
      <aside
        style={{ width: '380px', flexShrink: 0, borderLeft: '1px solid var(--border-strong)', background: 'var(--surface)', backdropFilter: 'blur(30px)', display: 'flex', flexDirection: 'column', position: 'relative' }}
      >
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, var(--bg-app))', pointerEvents: 'none', zIndex: 10, opacity: 0.5 }} />
        <div style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }} className="no-scrollbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={22} color="var(--primary)" />
              <div style={{ position: 'absolute', top: -4, right: -4, width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', border: '2px solid var(--surface)' }} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>Action Center</h2>
            {loading && <div className="neural-scanning-bar" />}
          </div>

          {messages.slice().reverse().find(m => m.is_structured) ? (
            <div style={{ animation: 'slideInFromRight 0.5s ease' }}>
              <div className="premium-card" style={{ padding: '24px', marginBottom: '24px', border: '1px solid var(--border-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Statutory Insight</h3>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '900' }}>VERIFIED</div>
                </div>
                <StructuredResponse data={messages.slice().reverse().find(m => m.is_structured)} />
              </div>

              <div className="premium-card" style={{ padding: '24px', border: '1px solid var(--primary-light)', background: 'linear-gradient(to bottom right, var(--primary-light), transparent)' }}>
                <h3 style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Intelligence Suite</h3>
                <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '20px', lineHeight: '1.6', fontWeight: '500' }}>Executive-grade documentation engine initialized for this case.</p>
                <PDFButton
                  onClick={() => setModalState('details')}
                  loading={pdfLoading}
                />
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 24px', animation: 'fadeIn 1s ease' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '32px' }}>
                <Archive size={64} style={{ color: 'var(--text3)', opacity: 0.2 }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={24} style={{ color: 'var(--primary)', opacity: 0.5, animation: 'reasoningPulse 2s infinite' }} />
                </div>
              </div>
              <h4 style={{ color: 'var(--text)', fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Analysis Requested</h4>
              <p style={{ color: 'var(--text3)', fontSize: '14px', fontWeight: '500', lineHeight: '1.6' }}>The strategic action layer will activate once a legal scenario is identified in the query.</p>
            </div>
          )}

          <div style={{ marginTop: '48px', borderTop: '1px solid var(--border-strong)', paddingTop: '48px' }}>
            <LocalHelpFinder />
            <ECourtsTracker />
          </div>
        </div>
      </aside>

      {/* 4. Global Intelligence Modals */}
      {modalState === 'details' && (
        <NoticeDetailsModal 
          docType={docType}
          setDocType={setDocType}
          onCancel={() => setModalState('closed')}
          onGenerate={async (details) => {
            setModalState('closed');
            setPdfLoading(true);
            try {
              const lastStructured = messages.slice().reverse().find(m => m.is_structured);
              const blob = await generatePDF({
                applicable_law: lastStructured.applicable_law,
                complaint_text: lastStructured.formal_draft || lastStructured.userMessage,
                user_language: 'English',
                ...details,
                document_type: docType
              });
              const url = URL.createObjectURL(blob);
              setPdfUrl(url);
              setModalState('preview');
            } catch (e) {
              console.error(e);
            } finally {
              setPdfLoading(false);
            }
          }}
        />
      )}

      {modalState === 'preview' && pdfUrl && (
        <PDFPreviewModal
          pdfUrl={pdfUrl}
          onDownload={() => {
            const a = document.createElement('a');
            a.href = pdfUrl;
            a.download = `NyayBot_${docType}.pdf`;
            a.click();
            setModalState('closed');
          }}
          onCancel={() => setModalState('closed')}
        />
      )}
    </div>
  );
}
