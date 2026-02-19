import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, Play, Clock, FileText, X, BookOpen, AlertCircle, Maximize } from 'lucide-react';
import { getCourseById } from '../data/courseData';

const outerWrap = {
    width: '100%',
    maxWidth: '1152px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '32px',
    paddingBottom: '80px',
};

/* ── Notes Modal ── */
function NotesModal({ notes, courseColor, onClose }) {
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
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '680px', maxHeight: '85vh', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', boxShadow: '0 32px 80px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: `linear-gradient(135deg, ${courseColor.from}22, ${courseColor.to}11)`, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${courseColor.from}, ${courseColor.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={18} color="#fff" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{notes.title}</h2>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>Lesson Notes</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} color="#94a3b8" />
                    </button>
                </div>

                {/* Content */}
                <div style={{ overflowY: 'auto', padding: '24px', flex: 1 }}>
                    {notes.sections.map((section, i) => (
                        <div key={i} style={{ marginBottom: i < notes.sections.length - 1 ? '28px' : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: '4px', height: '18px', borderRadius: '2px', background: `linear-gradient(135deg, ${courseColor.from}, ${courseColor.to})`, flexShrink: 0 }} />
                                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f1f5f9' }}>{section.heading}</h3>
                            </div>
                            <div style={{ borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '16px 18px' }}>
                                {section.content.split('\n').map((line, j) => (
                                    <p key={j} style={{ fontSize: '0.875rem', lineHeight: 1.75, color: '#94a3b8', marginBottom: j < section.content.split('\n').length - 1 ? '4px' : 0 }}>
                                        {line || <br />}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
                    <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', width: '100%', padding: '13px', borderRadius: '12px', border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${courseColor.from}, ${courseColor.to})`, fontSize: '0.9375rem', fontWeight: 600, color: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: '#64748b' }}>
                <p style={{ fontSize: '1rem', fontWeight: 500 }}>Lesson not found</p>
                <Link to="/" style={{ fontSize: '0.875rem', color: '#818cf8' }}>← Back to Home</Link>
            </div>
        );
    }

    const currentIndex = course.lessons.findIndex((l) => l.id === Number(lessonId));
    const prevLesson = course.lessons[currentIndex - 1];
    const nextLesson = course.lessons[currentIndex + 1];
    const hasNotes = Boolean(lesson.notes);
    const hasVideo = Boolean(lesson.videoUrl);
    const courseColor = { from: course.gradientFrom, to: course.gradientTo };

    // Extract YouTube video ID from embed URL for the fullscreen link
    const ytVideoId = hasVideo ? lesson.videoUrl.split('/embed/')[1]?.split('?')[0] : null;

    return (
        <>
            {notesOpen && hasNotes && (
                <NotesModal notes={lesson.notes} courseColor={courseColor} onClose={() => setNotesOpen(false)} />
            )}

            <div style={{ width: '100%' }}>
                <div style={outerWrap}>

                    {/* Breadcrumb */}
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', color: '#475569', marginBottom: '24px' }}>
                        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 }}
                            onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>Home</button>
                        <ChevronRight size={13} />
                        <button onClick={() => navigate(`/course/${courseId}`)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 0 }}
                            onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                            onMouseLeave={e => e.currentTarget.style.color = '#475569'}>{course.title}</button>
                        <ChevronRight size={13} />
                        <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{lesson.title}</span>
                    </nav>

                    {/* 2-col grid */}
                    <div className="vp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                        <style>{`@media(min-width:1024px){.vp-grid{grid-template-columns:2fr 1fr!important}}`}</style>

                        {/* ── Left column ── */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Video Player */}
                            <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', background: '#0d1117', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>

                                {/* 16:9 container */}
                                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#060a10' }}>
                                    {hasVideo ? (
                                        /* YouTube iframe */
                                        <iframe
                                            src={`${lesson.videoUrl}?rel=0&modestbranding=1`}
                                            title={lesson.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                                        />
                                    ) : (
                                        /* Placeholder */
                                        <>
                                            <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                                            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`, opacity: 0.05 }} />
                                            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                                                <button className="pulse-play" style={{ width: '80px', height: '80px', borderRadius: '50%', background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                                                    <Play size={32} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} />
                                                </button>
                                                <div style={{ textAlign: 'center', padding: '0 24px' }}>
                                                    <p style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>{lesson.title}</p>
                                                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>{course.title} · {lesson.duration}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Player info bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
                                        <span style={{ fontSize: '1rem' }}>{course.icon}</span>
                                        <span style={{ fontWeight: 500, color: '#fff' }}>{lesson.title}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#475569' }}>
                                            <Clock size={12} /> {lesson.duration}
                                        </span>
                                        {hasVideo && ytVideoId && (
                                            <a
                                                href={`https://www.youtube.com/watch?v=${ytVideoId}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title="Open fullscreen on YouTube"
                                                style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '7px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', textDecoration: 'none', transition: 'background 0.15s, color 0.15s' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
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
                                    width: '100%', padding: '16px', borderRadius: '14px', border: 'none',
                                    cursor: hasNotes ? 'pointer' : 'not-allowed',
                                    background: hasNotes ? `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` : 'rgba(255,255,255,0.05)',
                                    fontSize: '1rem', fontWeight: 600,
                                    color: hasNotes ? '#fff' : '#475569',
                                    boxShadow: hasNotes ? '0 8px 24px rgba(0,0,0,0.3)' : 'none',
                                    opacity: hasNotes ? 1 : 0.5,
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                }}
                                onMouseEnter={e => { if (hasNotes) { e.currentTarget.style.transform = 'scale(1.02)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                            >
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: hasNotes ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {hasNotes ? <FileText size={16} color="#fff" /> : <AlertCircle size={16} color="#475569" />}
                                </div>
                                {hasNotes ? 'View & Download Notes' : 'Notes Not Available for This Lesson'}
                            </button>

                            {/* Prev / Next */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {prevLesson ? (
                                    <button onClick={() => navigate(`/course/${courseId}/lesson/${prevLesson.id}`)}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94a3b8'; }}
                                    >
                                        <ChevronLeft size={15} />
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prevLesson.title}</span>
                                    </button>
                                ) : <div style={{ flex: 1 }} />}

                                {nextLesson ? (
                                    <button onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', color: '#94a3b8', fontSize: '0.875rem', fontWeight: 500 }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = '#94a3b8'; }}
                                    >
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextLesson.title}</span>
                                        <ChevronRight size={15} />
                                    </button>
                                ) : <div style={{ flex: 1 }} />}
                            </div>
                        </div>

                        {/* ── Right: Sidebar ── */}
                        <div style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Course Lessons</h3>
                                <span style={{ fontSize: '0.75rem', color: '#475569' }}>{course.lessons.length} total</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '480px', overflowY: 'auto' }}>
                                {course.lessons.map((l, i) => {
                                    const isActive = l.id === Number(lessonId);
                                    return (
                                        <button
                                            key={l.id}
                                            onClick={() => navigate(`/course/${courseId}/lesson/${l.id}`)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '10px',
                                                padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                textAlign: 'left', fontSize: '0.8125rem', fontWeight: 500,
                                                background: isActive ? `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})` : 'transparent',
                                                color: isActive ? '#fff' : '#94a3b8',
                                                transition: 'background 0.15s, color 0.15s',
                                            }}
                                            onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; } }}
                                            onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; } }}
                                        >
                                            <span style={{ width: '20px', textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: isActive ? 'rgba(255,255,255,0.6)' : '#475569', flexShrink: 0 }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                                            {l.notes && (
                                                <span title="Notes available" style={{ fontSize: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px', padding: '1px 5px', color: isActive ? '#fff' : '#94a3b8', flexShrink: 0 }}>📄</span>
                                            )}
                                            <span style={{ fontSize: '0.7rem', color: isActive ? 'rgba(255,255,255,0.6)' : '#475569', flexShrink: 0 }}>{l.duration}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
