import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, Play, Clock, FileText, X, BookOpen, AlertCircle, Maximize } from 'lucide-react';
import { getCourseById } from '../data/courseData';
import AIChatbot from '../components/AIChatbot';

const outerWrap = {
    width: '100%',
    maxWidth: '1152px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '20px',
    paddingBottom: '80px',
};

/* ── Notes Modal ── */
function NotesModal({ notes, accentColor, onClose }) {
    const handleDownload = () => {
        let text = `${notes.title}\n${'='.repeat(notes.title.length)}\n\n`;
        notes.sections.forEach((s) => {
            text += `${s.heading}\n${'-'.repeat(s.heading.length)}\n${s.content}\n\n`;
        });
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${notes.title.replace(/\s+/g, '_')}_Notes.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '680px', maxHeight: '85vh', borderRadius: '24px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 32px 80px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.5)' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${accentColor}40` }}>
                            <BookOpen size={18} color="#fff" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#333' }}>{notes.title}</h2>
                            <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '1px' }}>Lesson Notes</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: '#f1f1f4', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e4e4e8'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f1f1f4'}
                    >
                        <X size={16} color="#666" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
                    {notes.sections.map((section, i) => (
                        <div key={i} style={{ marginBottom: i < notes.sections.length - 1 ? '28px' : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '4px', height: '18px', borderRadius: '2px', backgroundColor: accentColor, flexShrink: 0 }} />
                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#333' }}>{section.heading}</h3>
                            </div>
                            <div style={{ borderRadius: '14px', backgroundColor: '#f8f8fb', border: '1px solid #eee', padding: '16px 18px' }}>
                                {section.content.split('\n').map((line, j) => (
                                    <p key={j} style={{ fontSize: '0.875rem', lineHeight: 1.75, color: '#555', marginBottom: j < section.content.split('\n').length - 1 ? '4px' : 0 }}>
                                        {line || <br />}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(0,0,0,0.06)', flexShrink: 0 }}>
                    <button onClick={handleDownload}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '14px', borderRadius: '14px', border: 'none', cursor: 'pointer', backgroundColor: accentColor, fontSize: '0.9375rem', fontWeight: 700, color: '#fff', boxShadow: `0 6px 20px ${accentColor}40`, transition: 'transform 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Download size={17} />
                        Download Notes (.txt)
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Main VideoPage ── */
export default function VideoPage() {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [notesOpen, setNotesOpen] = useState(false);

    const course = getCourseById(courseId);
    const lesson = course?.lessons.find((l) => l.id === Number(lessonId));

    if (!course || !lesson) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: '#333' }}>
                <p style={{ fontSize: '1rem', fontWeight: 500 }}>Lesson not found</p>
                <Link to="/" style={{ fontSize: '0.875rem', color: '#008080' }}>← Back to Home</Link>
            </div>
        );
    }

    const currentIndex = course.lessons.findIndex((l) => l.id === Number(lessonId));
    const prevLesson = course.lessons[currentIndex - 1];
    const nextLesson = course.lessons[currentIndex + 1];
    const hasNotes = Boolean(lesson.notes);
    const hasVideo = Boolean(lesson.videoUrl);
    const accent = course.accentColor;

    const ytVideoId = hasVideo ? lesson.videoUrl.split('/embed/')[1]?.split('?')[0] : null;

    return (
        <>
            {notesOpen && hasNotes && (
                <NotesModal notes={lesson.notes} accentColor={accent} onClose={() => setNotesOpen(false)} />
            )}

            <div className="page-enter" style={{ width: '100%' }}>
                <div style={outerWrap}>

                    {/* Breadcrumb */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#999', marginBottom: '24px' }}>
                        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}
                            onMouseEnter={e => e.currentTarget.style.color = '#008080'}
                            onMouseLeave={e => e.currentTarget.style.color = '#999'}>Home</button>
                        <ChevronRight size={13} />
                        <button onClick={() => navigate(`/course/${courseId}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 0 }}
                            onMouseEnter={e => e.currentTarget.style.color = '#008080'}
                            onMouseLeave={e => e.currentTarget.style.color = '#999'}>{course.title}</button>
                        <ChevronRight size={13} />
                        <span style={{ color: '#333', fontWeight: 600 }}>{lesson.title}</span>
                    </nav>

                    {/* 2-col grid */}
                    <div className="vp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <style>{`@media(min-width:1024px){.vp-grid{grid-template-columns:2fr 1fr!important}}`}</style>

                        {/* Left column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Video Player */}
                            <div className="glass-card" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#1a1a2e', borderRadius: '18px 18px 0 0', overflow: 'hidden' }}>
                                    {hasVideo ? (
                                        <iframe
                                            src={`${lesson.videoUrl}?rel=0&modestbranding=1`}
                                            title={lesson.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                                        />
                                    ) : (
                                        <>
                                            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${accent}22, ${accent}08)` }} />
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                                                <button className="pulse-play" style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: accent, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 30px ${accent}50` }}>
                                                    <Play size={30} color="#fff" fill="#fff" style={{ marginLeft: '3px' }} />
                                                </button>
                                                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{lesson.title}</p>
                                                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{course.title} · {lesson.duration}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Info bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                                        <span style={{ fontSize: '1rem' }}>{course.icon}</span>
                                        <span style={{ fontWeight: 600, color: '#333' }}>{lesson.title}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#888' }}>
                                            <Clock size={12} /> {lesson.duration}
                                        </span>
                                        {hasVideo && ytVideoId && (
                                            <a
                                                href={`https://www.youtube.com/watch?v=${ytVideoId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '10px', backgroundColor: '#f1f1f4', border: 'none', fontSize: '0.75rem', fontWeight: 600, color: '#555', textDecoration: 'none', transition: 'all 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#f1f1f4'; e.currentTarget.style.color = '#555'; }}
                                            >
                                                <Maximize size={13} />
                                                Fullscreen
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Notes Button */}
                            <button
                                onClick={() => hasNotes && setNotesOpen(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                                    width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                    cursor: hasNotes ? 'pointer' : 'not-allowed',
                                    backgroundColor: hasNotes ? accent : 'rgba(255,255,255,0.3)',
                                    fontSize: '1rem', fontWeight: 700,
                                    color: hasNotes ? '#fff' : 'rgba(255,255,255,0.4)',
                                    boxShadow: hasNotes ? `0 8px 24px ${accent}40` : 'none',
                                    opacity: hasNotes ? 1 : 0.6,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseEnter={e => { if (hasNotes) { e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <div style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: hasNotes ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {hasNotes ? <FileText size={16} color="#fff" /> : <AlertCircle size={16} color="rgba(255,255,255,0.4)" />}
                                </div>
                                {hasNotes ? 'View & Download Notes' : 'Notes Not Available'}
                            </button>

                            {/* Prev / Next */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {prevLesson ? (
                                    <button onClick={() => navigate(`/course/${courseId}/lesson/${prevLesson.id}`)}
                                        className="glass-card"
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '14px', cursor: 'pointer', color: '#333', fontSize: '0.875rem', fontWeight: 600, transition: 'transform 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <ChevronLeft size={15} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prevLesson.title}</span>
                                    </button>
                                ) : <div style={{ flex: 1 }} />}

                                {nextLesson ? (
                                    <button onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                                        className="glass-card"
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderRadius: '14px', cursor: 'pointer', color: '#333', fontSize: '0.875rem', fontWeight: 600, transition: 'transform 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextLesson.title}</span>
                                        <ChevronRight size={15} />
                                    </button>
                                ) : <div style={{ flex: 1 }} />}
                            </div>
                        </div>

                        {/* Right: Sidebar */}
                        <div className="glass-card" style={{ borderRadius: '20px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#333' }}>Course Lessons</h3>
                                <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 500 }}>{course.lessons.length} total</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', maxHeight: '480px', overflowY: 'auto' }}>
                                {course.lessons.map((l, i) => {
                                    const isActive = l.id === Number(lessonId);
                                    return (
                                        <button
                                            key={l.id}
                                            onClick={() => navigate(`/course/${courseId}/lesson/${l.id}`)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '10px 12px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                                textAlign: 'left', fontSize: '0.8125rem', fontWeight: 600,
                                                backgroundColor: isActive ? accent : 'transparent',
                                                color: isActive ? '#fff' : '#555',
                                                boxShadow: isActive ? `0 4px 14px ${accent}30` : 'none',
                                                transition: 'all 0.15s',
                                            }}
                                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.color = '#333'; } }}
                                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#555'; } }}
                                        >
                                            <span style={{ width: '22px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 800, color: isActive ? 'rgba(255,255,255,0.6)' : '#bbb', flexShrink: 0 }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                                            {l.notes && (
                                                <span title="Notes available" style={{ fontSize: '10px', backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#eee', borderRadius: '5px', padding: '2px 6px', flexShrink: 0 }}>📄</span>
                                            )}
                                            <span style={{ fontSize: '0.7rem', color: isActive ? 'rgba(255,255,255,0.6)' : '#bbb', flexShrink: 0 }}>{l.duration}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Chatbot */}
            <AIChatbot
                courseName={course.title}
                lessonTitle={lesson.title}
                accentColor={accent}
            />
        </>
    );
}
