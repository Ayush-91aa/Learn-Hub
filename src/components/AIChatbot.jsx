import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Trash2, Wand2, HelpCircle, Lightbulb, AlertTriangle, Puzzle } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODELS = [
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
];

const getUrl = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

function formatResponse(text) {
  const parts = [];
  const lines = text.split('\n');
  let inCodeBlock = false;
  let codeLines = [];
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        parts.push({ type: 'code', lang: codeLang, content: codeLines.join('\n') });
        codeLines = [];
        codeLang = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeLang = line.slice(3).trim() || 'code';
      }
    } else if (inCodeBlock) {
      codeLines.push(line);
    } else {
      parts.push({ type: 'text', content: line });
    }
  }
  if (codeLines.length > 0) {
    parts.push({ type: 'code', lang: codeLang, content: codeLines.join('\n') });
  }
  return parts;
}

function MessageBubble({ msg, accentColor }) {
  const isBot = msg.role === 'bot';
  const parts = isBot ? formatResponse(msg.text) : [{ type: 'text', content: msg.text }];

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      flexDirection: isBot ? 'row' : 'row-reverse',
      alignItems: 'flex-start',
      animation: 'fadeUp 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      maxWidth: '100%',
    }}>
      {/* Avatar */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '12px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isBot
          ? `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}cc 100%)`
          : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        boxShadow: isBot
          ? `0 6px 20px ${accentColor}50`
          : '0 6px 20px rgba(14, 165, 233, 0.4)',
        border: '1px solid rgba(255,255,255,0.15)',
      }}>
        {isBot ? <Bot size={17} color="#fff" /> : <User size={17} color="#fff" />}
      </div>

      {/* Message */}
      <div style={{
        maxWidth: 'calc(100% - 56px)',
        minWidth: '0',
      }}>
        <div style={{
          padding: isBot ? '14px 18px' : '14px 18px',
          borderRadius: isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
          background: isBot
            ? 'rgba(255, 255, 255, 0.97)'
            : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          color: isBot ? '#1e293b' : '#fff',
          fontSize: '0.875rem',
          lineHeight: 1.7,
          boxShadow: isBot
            ? '0 4px 16px rgba(30, 41, 59, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
            : '0 6px 20px rgba(14, 165, 233, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.15) inset',
          border: isBot ? '1px solid rgba(255, 255, 255, 0.7)' : 'none',
          backdropFilter: isBot ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: isBot ? 'blur(10px)' : 'none',
        }}>
          {parts.map((part, i) => {
            if (part.type === 'code') {
              return (
                <div key={i} style={{
                  margin: '10px 0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 14px',
                    backgroundColor: '#0f172a',
                    fontSize: '0.7rem', fontWeight: 700,
                    color: 'rgba(255, 255, 255, 0.6)',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    <span>{part.lang}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(part.content)}
                      style={{
                        background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer',
                        fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)',
                        padding: '4px 10px', borderRadius: '6px',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    >
                      Copy
                    </button>
                  </div>
                  <pre style={{
                    padding: '14px 16px',
                    backgroundColor: '#1e293b',
                    color: '#e2e8f0',
                    fontSize: '0.8125rem',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    margin: 0,
                    fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                  }}>
                    <code>{part.content}</code>
                  </pre>
                </div>
              );
            }
            const line = part.content;
            if (!line) return <div key={i} style={{ height: '4px' }} />;
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} style={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.9375rem' }}>{line.slice(2, -2)}</p>;
            }
            if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
              return (
                <p key={i} style={{ paddingLeft: '16px', position: 'relative', marginBottom: '3px', color: isBot ? '#475569' : 'rgba(255,255,255,0.95)' }}>
                  <span style={{ position: 'absolute', left: 0, color: accentColor, fontWeight: 700 }}>•</span>
                  {line.slice(2)}
                </p>
              );
            }
            return <p key={i} style={{ marginBottom: '3px', color: isBot ? '#475569' : 'rgba(255,255,255,0.95)' }}>{line}</p>;
          })}
        </div>
      </div>
    </div>
  );
}

const quickQuestions = [
  { text: 'Explain this topic simply', icon: HelpCircle },
  { text: 'Give me an example', icon: Lightbulb },
  { text: 'What are common mistakes?', icon: AlertTriangle },
  { text: 'Give me a practice problem', icon: Puzzle },
];

export default function AIChatbot({ courseName, lessonTitle, accentColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', text: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const systemPrompt = `You are a friendly and expert coding tutor on the "Learn Hub" platform. The student is currently learning "${courseName}" and is on the lesson "${lessonTitle}".

Rules:
- Answer questions related to the current lesson/course topic.
- Use simple language suitable for beginners.
- Include code examples when relevant, using markdown code blocks.
- Use bullet points for lists.
- Keep responses concise but thorough (max 300 words).
- If asked something unrelated to coding/programming, politely redirect to the topic.
- Be encouraging and supportive.
- Use emojis sparingly to keep it friendly.`;

    const conversationHistory = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    try {
      const body = JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [
          ...conversationHistory,
          { role: 'user', parts: [{ text: text.trim() }] }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        }
      });

      let reply = null;
      for (const model of MODELS) {
        try {
          const res = await fetch(getUrl(model), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
          const data = await res.json();
          if (res.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            reply = data.candidates[0].content.parts[0].text;
            break;
          }
          console.warn(`Model ${model} failed:`, data?.error?.message || res.status);
        } catch (e) {
          console.warn(`Model ${model} error:`, e.message);
        }
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply || 'Sorry, I couldn\'t generate a response. All models are currently unavailable. Please try again later!' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Oops! Something went wrong. Please check your internet connection and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Action Button with glass */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 1000,
          width: '64px', height: '64px',
          borderRadius: '20px',
          background: isOpen
            ? 'rgba(30, 41, 59, 0.9)'
            : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          border: isOpen ? '2px solid rgba(255,255,255,0.2)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isOpen
            ? '0 12px 40px rgba(30, 41, 59, 0.4), 0 0 0 4px rgba(255,255,255,0.1)'
            : '0 8px 32px rgba(14, 165, 233, 0.45), 0 4px 16px rgba(14, 165, 233, 0.3), 0 0 0 4px rgba(14, 165, 233, 0.1)',
          transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          transform: isOpen ? 'scale(0.92) rotate(90deg)' : 'scale(1)',
        }}
        onMouseEnter={e => {
          if (!isOpen) {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(14, 165, 233, 0.55), 0 6px 20px rgba(14, 165, 233, 0.4), 0 0 0 6px rgba(14, 165, 233, 0.15)';
          }
        }}
        onMouseLeave={e => {
          if (!isOpen) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(14, 165, 233, 0.45), 0 4px 16px rgba(14, 165, 233, 0.3), 0 0 0 4px rgba(14, 165, 233, 0.1)';
          }
        }}
      >
        {isOpen
          ? <X size={26} color="#fff" />
          : <Wand2 size={26} color="#fff" />
        }
      </button>

      {/* Chat Window with premium glass dark theme */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          right: '28px',
          zIndex: 999,
          width: '420px',
          maxWidth: 'calc(100vw - 56px)',
          height: '580px',
          maxHeight: 'calc(100vh - 140px)',
          borderRadius: '28px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.99) 100%)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 32px 100px rgba(0, 0, 0, 0.45), 0 16px 50px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.08) inset',
          animation: 'chatOpen 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}>
          {/* Top gradient accent line */}
          <div style={{
            height: '3px',
            background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            opacity: 0.7,
          }} />

          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 22px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '14px',
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}dd 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 6px 20px ${accentColor}50`,
              }}>
                <Sparkles size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{
                  fontSize: '1rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em'
                }}>
                  AI Doubt Solver
                </h3>
                <p style={{
                  fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px',
                }}>
                  {courseName} • {lessonTitle}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={clearChat}
                style={{
                  width: '38px', height: '38px',
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                title="Clear chat"
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              >
                <Trash2 size={16} color="rgba(255,255,255,0.7)" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="custom-scrollbar" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {messages.length === 0 && (
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                height: '100%', gap: '24px', padding: '30px',
              }}>
                {/* Hero illustration */}
                <div style={{
                  width: '80px', height: '80px', borderRadius: '24px',
                  background: `radial-gradient(ellipse at 30% 20%, ${accentColor}40 0%, transparent 60%),
                             radial-gradient(circle at 70% 80%, #0ea5e930 0%, transparent 50%),
                             linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 12px 40px ${accentColor}30, 0 0 0 1px rgba(255,255,255,0.1) inset`,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <Bot size={36} color="#fff" />
                </div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{
                    fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '6px'
                  }}>
                    Hi there! 👋
                  </p>
                  <p style={{
                    fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5
                  }}>
                    Ask me anything about<br />
                    <span style={{
                      color: '#0ea5e9', fontWeight: 700,
                      textShadow: '0 0 20px rgba(14, 165, 233, 0.4)',
                    }}>{lessonTitle}</span>
                  </p>
                </div>

                {/* Quick questions glass pills */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '8px'
                }}>
                  {quickQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q.text)}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: 'rgba(255, 255, 255, 0.85)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                        e.currentTarget.style.transform = 'translateX(8px) scale(1.02)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.transform = 'translateX(0) scale(1)';
                      }}
                    >
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                      }}>
                        <span style={{
                          width: '32px', height: '32px', borderRadius: '10px',
                          background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '16px',
                        }}>
                          {(() => { const IconComponent = q.icon; return <IconComponent size={16} color={accentColor} />; })()}
                        </span>
                        {q.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <MessageBubble key={i} msg={msg} accentColor={accentColor} />
            ))}

            {loading && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 18px', borderRadius: '18px',
                background: 'rgba(255, 255, 255, 0.97)',
                width: 'fit-content',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
                border: '1px solid rgba(255, 255, 255, 0.7)',
              }}>
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: accentColor,
                  animation: 'bounce 0.6s infinite alternate',
                  animationDelay: '0s',
                }} />
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: accentColor,
                  animation: 'bounce 0.6s infinite alternate',
                  animationDelay: '0.15s',
                }} />
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: accentColor,
                  animation: 'bounce 0.6s infinite alternate',
                  animationDelay: '0.3s',
                }} />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: '16px 20px',
            background: 'rgba(255, 255, 255, 0.02)',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            flexShrink: 0,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '6px 6px 6px 18px',
              transition: 'all 0.2s ease',
            }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.9375rem',
                  fontFamily: 'inherit',
                  minHeight: '44px',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                style={{
                  width: '44px', height: '44px',
                  borderRadius: '14px',
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                  boxShadow: input.trim() && !loading ? '0 6px 20px rgba(14, 165, 233, 0.4)' : 'none',
                }}
                onMouseEnter={e => {
                  if (input.trim() && !loading) {
                    e.currentTarget.style.transform = 'scale(1.08)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(14, 165, 233, 0.5)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = input.trim() && !loading ? '0 6px 20px rgba(14, 165, 233, 0.4)' : 'none';
                }}
              >
                <Send size={18} color={input.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.3)'} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline styles for animations */}
      <style>{`
        @keyframes chatOpen {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounce {
          from { transform: translateY(0); opacity: 0.5; }
          to { transform: translateY(-8px); opacity: 1; }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
