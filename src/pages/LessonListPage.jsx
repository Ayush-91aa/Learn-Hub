import { useParams, useNavigate, Link } from 'react-router-dom';
import { PlayCircle, ChevronLeft, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { getCourseById } from '../data/courseData';

const wrap = {
    width: '100%',
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '40px',
    paddingBottom: '80px',
};

export default function LessonListPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const course = getCourseById(courseId);

    if (!course) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: '#64748b' }}>
                <BookOpen size={40} style={{ opacity: 0.3 }} />
                <p style={{ fontSize: '1rem', fontWeight: 500 }}>Course not found</p>
                <Link to="/" style={{ fontSize: '0.875rem', color: '#818cf8' }}>← Back to Home</Link>
            </div>
        );
    }

    const totalDuration = course.lessons.reduce((acc, l) => {
        const [m, s] = l.duration.split(':').map(Number);
        return acc + m * 60 + s;
    }, 0);
    const totalMins = Math.round(totalDuration / 60);

    return (
        <div style={{ width: '100%' }}>
            <div style={wrap}>

                {/* Back */}
                <button
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 500, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '32px', padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
                    onMouseLeave={e => e.currentTarget.style.color = '#64748b'}
                >
                    <ChevronLeft size={15} />
                    All Courses
                </button>

                {/* Course Header */}
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.07)',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '28px 32px',
                    marginBottom: '32px',
                }}>
                    {/* Glow */}
                    <div style={{
                        position: 'absolute', right: '-40px', top: '-40px',
                        width: '160px', height: '160px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                        opacity: 0.18, filter: 'blur(40px)', pointerEvents: 'none',
                    }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative' }}>
                        {/* Icon */}
                        <div style={{
                            flexShrink: 0, width: '64px', height: '64px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '14px',
                            background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                            fontSize: '28px',
                        }}>
                            {course.icon}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{course.title}</h1>
                            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '12px' }}>{course.description}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.75rem', color: '#64748b' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <BookOpen size={12} /> {course.lessons.length} lessons
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={12} /> ~{totalMins} min total
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                                    <CheckCircle size={12} /> Free access
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section label */}
                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#475569', marginBottom: '12px' }}>
                    Course Content
                </p>

                {/* Lesson rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {course.lessons.map((lesson, index) => (
                        <button
                            key={lesson.id}
                            onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)',
                                background: 'rgba(255,255,255,0.03)',
                                padding: '14px 20px', textAlign: 'left', cursor: 'pointer',
                                transition: 'border-color 0.2s, background 0.2s',
                                width: '100%',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                            {/* Number badge */}
                            <div style={{
                                flexShrink: 0, width: '32px', height: '32px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '50%', background: 'rgba(255,255,255,0.06)',
                                fontSize: '0.7rem', fontWeight: 700, color: '#64748b',
                            }}>
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Title */}
                            <p style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, color: '#cbd5e1' }}>
                                {lesson.title}
                            </p>

                            {/* Duration */}
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#475569', flexShrink: 0 }}>
                                <Clock size={11} /> {lesson.duration}
                            </span>

                            {/* Play */}
                            <PlayCircle size={20} color="#334155" style={{ flexShrink: 0 }} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
