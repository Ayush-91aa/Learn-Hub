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
    paddingTop: '20px',
    paddingBottom: '80px',
};

export default function LessonListPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const course = getCourseById(courseId);

    if (!course) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: '#333' }}>
                <BookOpen size={40} style={{ opacity: 0.5 }} />
                <p style={{ fontSize: '1rem', fontWeight: 500 }}>Course not found</p>
                <Link to="/" style={{ fontSize: '0.875rem', color: '#008080' }}>← Back to Home</Link>
            </div>
        );
    }

    const totalDuration = course.lessons.reduce((acc, l) => {
        const [m, s] = l.duration.split(':').map(Number);
        return acc + m * 60 + s;
    }, 0);
    const totalMins = Math.round(totalDuration / 60);

    return (
        <div className="page-enter" style={{ width: '100%' }}>
            <div style={wrap}>

                {/* Back */}
                <button
                    onClick={() => navigate('/')}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.875rem', fontWeight: 600, color: '#999', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '24px', padding: 0 }}
                    onMouseEnter={e => e.currentTarget.style.color = '#008080'}
                    onMouseLeave={e => e.currentTarget.style.color = '#999'}
                >
                    <ChevronLeft size={15} />
                    All Courses
                </button>

                {/* Course Header */}
                <div className="glass-card" style={{
                    borderRadius: '20px',
                    padding: '28px 32px',
                    marginBottom: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                        <div style={{
                            flexShrink: 0, width: '64px', height: '64px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '16px',
                            backgroundColor: course.accentColor,
                            fontSize: '28px',
                            boxShadow: `0 6px 20px ${course.accentColor}40`,
                        }}>
                            {course.icon}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#333', marginBottom: '4px', letterSpacing: '-0.02em' }}>{course.title}</h1>
                            <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '14px' }}>{course.description}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.75rem', color: '#888' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <BookOpen size={12} /> {course.lessons.length} lessons
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={12} /> ~{totalMins} min total
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80' }}>
                                    <CheckCircle size={12} /> Free access
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section label */}
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '12px' }}>
                    Course Content
                </p>

                {/* Lesson rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {course.lessons.map((lesson, index) => (
                        <button
                            key={lesson.id}
                            onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
                            className="card-3d"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '16px',
                                borderRadius: '14px',
                                background: '#fff',
                                border: '1px solid #e0e0e0',
                                padding: '14px 20px', textAlign: 'left', cursor: 'pointer',
                                width: '100%',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            }}
                        >
                            <div style={{
                                flexShrink: 0, width: '34px', height: '34px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                borderRadius: '10px', backgroundColor: `${course.accentColor}18`,
                                fontSize: '0.75rem', fontWeight: 800, color: course.accentColor,
                            }}>
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <p style={{ flex: 1, fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>
                                {lesson.title}
                            </p>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#999', flexShrink: 0 }}>
                                <Clock size={11} /> {lesson.duration}
                            </span>
                            <PlayCircle size={20} color={course.accentColor} style={{ flexShrink: 0, opacity: 0.5 }} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
