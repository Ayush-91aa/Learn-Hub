import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download, Play, Clock, FileText, X, BookOpen, AlertCircle, Maximize, Pause } from 'lucide-react';
import { getCourseById } from '../data/courseData';
import AIChatbot from '../components/AIChatbot';

const outerWrap = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '90px',
  paddingBottom: '80px',
};

/* ── Glass Notes Modal ── */
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
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: '680px', maxHeight: '85vh',
        borderRadius: '28px',
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(30px)',
        boxShadow: '0 32px 80px rgba(30, 41, 59, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.6) inset',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.7)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '24px 28px',
          borderBottom: '1px solid rgba(30, 41, 59, 0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 6px 20px ${accentColor}40`,
            }}>
              <BookOpen size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#1e293b' }}>{notes.title}</h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Lesson Notes</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'rgba(30, 41, 59, 0.05)',
            border: '1px solid rgba(30, 41, 59, 0.08)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s ease',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.05)';
              e.currentTarget.style.borderColor = 'rgba(30, 41, 59, 0.08)';
            }}
          >
            <X size={18} color="#64748b" />
          </button>
        </div>

        {/* Content */}
        <div style={{ overflowY: 'auto', padding: '28px', flex: 1 }}>
          {notes.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: i < notes.sections.length - 1 ? '28px' : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '4px', height: '20px', borderRadius: '2px',
                  background: accentColor, flexShrink: 0,
                }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>{section.heading}</h3>
              </div>
              <div style={{
                borderRadius: '16px',
                background: 'rgba(248, 250, 252, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                padding: '18px 20px',
              }}>
                {section.content.split('\n').map((line, j) => (
                  <p key={j} style={{
                    fontSize: '0.9rem', lineHeight: 1.75, color: '#475569',
                    marginBottom: j < section.content.split('\n').length - 1 ? '6px' : 0,
                  }}>
                    {line || <br />}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '18px 28px',
          borderTop: '1px solid rgba(30, 41, 59, 0.06)',
          flexShrink: 0,
        }}>
          <button onClick={handleDownload}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width: '100%', padding: '16px', borderRadius: '16px',
              border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              fontSize: '1rem', fontWeight: 700, color: '#fff',
              boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)',
              transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.5)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1) translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
            }}
          >
            <Download size={18} />
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
  const [isPlaying, setIsPlaying] = useState(false);

  const course = getCourseById(courseId);
  const lesson = course?.lessons.find((l) => l.id === Number(lessonId));

  if (!course || !lesson) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh', gap: '16px', color: '#1e293b',
      }}>
        <p style={{ fontSize: '1rem', fontWeight: 500 }}>Lesson not found</p>
        <Link to="/" style={{ fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 600 }}>← Back to Home</Link>
      </div>
    );
  }

  const currentIndex = course.lessons.findIndex((l) => l.id === Number(lessonId));
  const prevLesson = course.lessons[currentIndex - 1];
  const nextLesson = course.lessons[currentIndex + 1];
  const hasNotes = Boolean(lesson.videoUrl);
  const accent = course.accentColor;

  const ytVideoId = hasNotes ? lesson.videoUrl.split('/embed/')[1]?.split('?')[0] : null;

  return (
    <>
      {notesOpen && hasNotes && (
        <NotesModal notes={lesson.notes} accentColor={accent} onClose={() => setNotesOpen(false)} />
      )}

      <div className="page-enter" style={{ width: '100%' }}>
        <div style={outerWrap}>

          {/* Glass Breadcrumb */}
          <nav style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            fontSize: '0.875rem', color: '#94a3b8', marginBottom: '28px',
            padding: '12px 18px', borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            width: 'fit-content',
          }}>
            <button onClick={() => navigate('/')} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
              fontSize: '0.875rem', fontWeight: 500,
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >Home</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate(`/course/${courseId}`)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0,
              fontSize: '0.875rem', fontWeight: 500,
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#0ea5e9'}
              onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
            >{course.title}</button>
            <ChevronRight size={14} />
            <span style={{ color: '#1e293b', fontWeight: 700 }}>{lesson.title}</span>
          </nav>

          {/* 2-col grid */}
          <div className="vp-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '28px' }}>
            <style>{`@media(min-width:1024px){.vp-grid{grid-template-columns: 2fr 1fr !important}}`}</style>

            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* Glass Video Player */}
              <div className="glass-card" style={{
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(30, 41, 59, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              }}>
                <div style={{
                  position: 'relative', paddingTop: '56.25%',
                  backgroundColor: '#0f172a',
                  borderRadius: '24px 24px 0 0',
                  overflow: 'hidden',
                }}>
                  {hasNotes ? (
                    <iframe
                      src={`${lesson.videoUrl}?rel=0&modestbranding=1`}
                      title={lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    />
                  ) : (
                    <>
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: `linear-gradient(135deg, ${accent}22, ${accent}08)`,
                      }} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px',
                      }}>
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="pulse-play"
                          style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
                            border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: `0 12px 40px ${accent}50, 0 0 0 4px rgba(255,255,255,0.15)`,
                            transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.transform = 'scale(1.08)';
                            e.currentTarget.style.boxShadow = `${accent}70, 0 0 0 6px rgba(255,255,255,0.2)`;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = `${accent}50, 0 0 0 4px rgba(255,255,255,0.15)`;
                          }}
                        >
                          {isPlaying ? <Pause size={32} color="#fff" fill="#fff" /> : <Play size={32} color="#fff" fill="#fff" style={{ marginLeft: '4px' }} />}
                        </button>
                        <div style={{ textAlign: 'center', padding: '0 24px' }}>
                          <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff' }}>{lesson.title}</p>
                          <p style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>
                            {course.title} · {lesson.duration}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Info bar */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '18px 24px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                    <span style={{ fontSize: '1.25rem' }}>{course.icon}</span>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>{lesson.title}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      fontSize: '0.8rem', color: '#94a3b8',
                      padding: '8px 14px', borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.5)',
                    }}>
                      <Clock size={13} />
                      {lesson.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Glass Notes Button */}
              <button
                onClick={() => hasNotes && setNotesOpen(true)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px',
                  width: '100%', padding: '18px', borderRadius: '18px', border: 'none',
                  cursor: hasNotes ? 'pointer' : 'not-allowed',
                  background: hasNotes
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.9))'
                    : 'rgba(255,255,255,0.3)',
                  fontSize: '1rem', fontWeight: 700,
                  color: hasNotes ? accent : 'rgba(30, 41, 59, 0.4)',
                  boxShadow: hasNotes ? '0 8px 28px rgba(30, 41, 59, 0.08)' : 'none',
                  opacity: hasNotes ? 1 : 0.6,
                  transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                  border: hasNotes ? '1px solid rgba(255, 255, 255, 0.6)' : '1px solid rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => { if (hasNotes) { e.currentTarget.style.transform = 'scale(1.02) translateY(-2px)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1) translateY(0)'; }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: `${accent}15`, border: `1px solid ${accent}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {hasNotes ? <FileText size={18} color={accent} /> : <AlertCircle size={18} color="#94a3b8" />}
                </div>
                {hasNotes ? 'View & Download Notes' : 'Notes Not Available'}
              </button>

              {/* Glass Prev / Next */}
              <div style={{ display: 'flex', gap: '14px' }}>
                {prevLesson ? (
                  <button onClick={() => navigate(`/course/${courseId}/lesson/${prevLesson.id}`)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '16px 20px', borderRadius: '16px', cursor: 'pointer',
                      color: '#1e293b', fontSize: '0.875rem', fontWeight: 600,
                      transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                      background: 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 4px 16px rgba(30, 41, 59, 0.05)',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(30, 41, 59, 0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 41, 59, 0.05)'
                    }}
                  >
                    <ChevronLeft size={18} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prevLesson.title}</span>
                  </button>
                ) : <div style={{ flex: 1 }} />}

                {nextLesson ? (
                  <button onClick={() => navigate(`/course/${courseId}/lesson/${nextLesson.id}`)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px',
                      padding: '16px 20px', borderRadius: '16px', cursor: 'pointer',
                      color: '#1e293b', fontSize: '0.875rem', fontWeight: 600,
                      transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                      background: 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.5)',
                      boxShadow: '0 4px 16px rgba(30, 41, 59, 0.05)',
                      textAlign: 'right',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(30, 41, 59, 0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 41, 59, 0.05)';
                    }}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{nextLesson.title}</span>
                    <ChevronRight size={18} />
                  </button>
                ) : <div style={{ flex: 1 }} />}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-card" style={{
                borderRadius: '24px', padding: '24px',
                position: 'sticky', top: '100px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Course Lessons</h3>
                  <span style={{
                    fontSize: '0.75rem', color: '#64748b', fontWeight: 600,
                    padding: '6px 12px', borderRadius: '20px',
                    background: 'rgba(14, 165, 233, 0.08)',
                  }}>{course.lessons.length} total</span>
                </div>
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '6px',
                  maxHeight: '480px', overflowY: 'auto',
                }}>
                  {course.lessons.map((l, i) => {
                    const isActive = l.id === Number(lessonId);
                    return (
                      <button
                        key={l.id}
                        onClick={() => navigate(`/course/${courseId}/lesson/${l.id}`)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 14px', borderRadius: '14px', border: 'none',
                          cursor: 'pointer', textAlign: 'left',
                          fontSize: '0.85rem', fontWeight: isActive ? 700 : 600,
                          background: isActive ? accent : 'transparent',
                          color: isActive ? '#fff' : '#475569',
                          boxShadow: isActive ? `0 6px 20px ${accent}40` : 'none',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(14, 165, 233, 0.06)';
                            e.currentTarget.style.color = '#1e293b';
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#475569';
                          }
                        }}
                      >
                        <span style={{
                          width: '24px', textAlign: 'center',
                          fontSize: '0.7rem', fontWeight: 800,
                          color: isActive ? 'rgba(255,255,255,0.7)' : '#cbd5e1',
                          flexShrink: 0,
                        }}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span style={{
                          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{l.title}</span>
                        {l.notes && (
                          <span style={{
                            fontSize: '10px',
                            backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(226, 232, 240, 0.8)',
                            borderRadius: '5px', padding: '3px 7px', flexShrink: 0,
                          }}>📄</span>
                        )}
                        <span style={{
                          fontSize: '0.7rem',
                          color: isActive ? 'rgba(255,255,255,0.7)' : '#cbd5e1',
                          flexShrink: 0,
                        }}>{l.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot courseName={course.title} lessonTitle={lesson.title} accentColor={accent} />
    </>
  );
}
