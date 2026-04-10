import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Trash2 } from 'lucide-react';

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
            gap: '10px',
            flexDirection: isBot ? 'row' : 'row-reverse',
            alignItems: 'flex-start',
            animation: 'fadeUp 0.3s ease forwards',
        }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isBot ? accentColor : 'rgba(255,255,255,0.15)',
                boxShadow: isBot ? `0 4px 12px ${accentColor}40` : 'none',
            }}>
                {isBot ? <Bot size={16} color="#fff" /> : <User size={16} color="#fff" />}
            </div>
            <div style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                background: isBot ? 'rgba(255,255,255,0.92)' : accentColor,
                color: isBot ? '#1a1a2e' : '#fff',
                fontSize: '0.875rem',
                lineHeight: 1.7,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                border: isBot ? '1px solid rgba(0,0,0,0.06)' : 'none',
                backdropFilter: 'blur(8px)',
            }}>
                {parts.map((part, i) => {
                    if (part.type === 'code') {
                        return (
                            <div key={i} style={{
                                margin: '8px 0',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid rgba(0,0,0,0.08)',
                            }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '6px 12px',
                                    backgroundColor: '#1e1e2e',
                                    fontSize: '0.7rem', fontWeight: 700,
                                    color: 'rgba(255,255,255,0.5)',
                                    textTransform: 'uppercase', letterSpacing: '0.05em',
                                }}>
                                    <span>{part.lang}</span>
                                    <button
                                        onClick={() => navigator.clipboard.writeText(part.content)}
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)',
                                            padding: '2px 6px', borderRadius: '4px',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                                    >
                                        Copy
                                    </button>
                                </div>
                                <pre style={{
                                    padding: '12px 14px',
                                    backgroundColor: '#282a36',
                                    color: '#f8f8f2',
                                    fontSize: '0.8rem',
                                    lineHeight: 1.6,
                                    overflowX: 'auto',
                                    margin: 0,
                                    fontFamily: "'Fira Code', 'Consolas', monospace",
                                }}>
                                    <code>{part.content}</code>
                                </pre>
                            </div>
                        );
                    }
                    const line = part.content;
                    if (!line) return <div key={i} style={{ height: '6px' }} />;
                    if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} style={{ fontWeight: 700, marginBottom: '4px' }}>{line.slice(2, -2)}</p>;
                    }
                    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
                        return (
                            <p key={i} style={{ paddingLeft: '14px', position: 'relative', marginBottom: '2px' }}>
                                <span style={{ position: 'absolute', left: 0, color: accentColor, fontWeight: 700 }}>•</span>
                                {line.slice(2)}
                            </p>
                        );
                    }
                    return <p key={i} style={{ marginBottom: '2px' }}>{line}</p>;
                })}
            </div>
        </div>
    );
}

const quickQuestions = [
    '🤔 Explain this topic simply',
    '💡 Give me an example',
    '❓ What are common mistakes?',
    '🧪 Give me a practice problem',
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
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-fab"
                style={{
                    position: 'fixed',
                    bottom: '28px',
                    right: '28px',
                    zIndex: 1000,
                    width: '60px', height: '60px',
                    borderRadius: '18px',
                    backgroundColor: accentColor,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 8px 32px ${accentColor}60, 0 0 0 4px rgba(255,255,255,0.15)`,
                    transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                    transform: isOpen ? 'scale(0.9) rotate(90deg)' : 'scale(1)',
                }}
            >
                {isOpen ? <X size={24} color="#fff" /> : <MessageCircle size={24} color="#fff" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="chatbot-window"
                    style={{
                        position: 'fixed',
                        bottom: '100px',
                        right: '28px',
                        zIndex: 999,
                        width: '400px',
                        maxWidth: 'calc(100vw - 56px)',
                        height: '560px',
                        maxHeight: 'calc(100vh - 140px)',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        boxShadow: '0 24px 80px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1) inset',
                        animation: 'chatOpen 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                    }}
                >
                    {/* Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '16px 20px',
                        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                        flexShrink: 0,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '12px',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <Sparkles size={18} color="#fff" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
                                    AI Doubt Solver
                                </h3>
                                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginTop: '1px' }}>
                                    {courseName} • {lessonTitle}
                                </p>
                            </div>
                        </div>
                        <button onClick={clearChat}
                            style={{
                                background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
                                borderRadius: '10px', padding: '8px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}
                            title="Clear chat"
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                        >
                            <Trash2 size={15} color="#fff" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                    }}>
                        {messages.length === 0 && (
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                height: '100%', gap: '20px', padding: '20px',
                            }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '20px',
                                    background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 8px 24px ${accentColor}40`,
                                }}>
                                    <Bot size={30} color="#fff" />
                                </div>
                                <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>
                                    Hi! 👋 Ask me anything about
                                </p>
                                <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: '-12px' }}>
                                    <strong style={{ color: '#ffd93d' }}>{lessonTitle}</strong>
                                </p>

                                {/* Quick questions */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '8px' }}>
                                    {quickQuestions.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => sendMessage(q.replace(/^[^\s]+\s/, ''))}
                                            style={{
                                                padding: '10px 16px',
                                                borderRadius: '12px',
                                                background: 'rgba(255,255,255,0.1)',
                                                border: '1px solid rgba(255,255,255,0.15)',
                                                color: 'rgba(255,255,255,0.85)',
                                                fontSize: '0.8125rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                                                e.currentTarget.style.transform = 'translateX(4px)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                                e.currentTarget.style.transform = 'translateX(0)';
                                            }}
                                        >
                                            {q}
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
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 16px', borderRadius: '16px',
                                background: 'rgba(255,255,255,0.88)',
                                width: 'fit-content',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: '1px solid rgba(0,0,0,0.06)',
                            }}>
                                <Loader2 size={16} color={accentColor} className="spin-anim" style={{ animation: 'spin 1s linear infinite' }} />
                                <span style={{ fontSize: '0.8125rem', color: '#888', fontWeight: 500 }}>Thinking...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '12px 16px',
                        borderTop: '1px solid rgba(255,255,255,0.1)',
                        flexShrink: 0,
                        background: 'rgba(0,0,0,0.1)',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.12)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            padding: '4px 4px 4px 16px',
                        }}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask a doubt..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: '#fff',
                                    fontSize: '0.875rem',
                                    fontFamily: 'inherit',
                                }}
                            />
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={!input.trim() || loading}
                                style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '12px',
                                    backgroundColor: input.trim() && !loading ? accentColor : 'rgba(255,255,255,0.08)',
                                    border: 'none',
                                    cursor: input.trim() && !loading ? 'pointer' : 'default',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                    boxShadow: input.trim() && !loading ? `0 4px 14px ${accentColor}40` : 'none',
                                }}
                            >
                                <Send size={16} color={input.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.3)'} />
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
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .chatbot-fab:hover {
                    transform: scale(1.08) !important;
                    box-shadow: 0 12px 40px ${accentColor}70, 0 0 0 4px rgba(255,255,255,0.2) !important;
                }
                .chatbot-window::-webkit-scrollbar { width: 4px; }
                .chatbot-window::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
            `}</style>
        </>
    );
}
