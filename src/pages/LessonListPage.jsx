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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: '#1e293b' }}>
        <BookOpen size={40} style={{ opacity: 0.5 }} />
        <p style={{ fontSize: '1rem', fontWeight: 500 }}>Course not found</p>
        <Link to="/" style={{ fontSize: '0.875rem', color: '#0ea5e9', fontWeight: 600 }}>← Back to Home</Link>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce((acc, l) => {
    const [m, s] = l.duration.split(':').map(Number);
    return acc + m * 60 + s;
  }, 0);
  const totalMins = Math.round(totalDuration / 60);

  return (
    <div className="page-enter" style={{ width: '100%', minHeight: '100vh' }}>
      <div style={wrap}>

        {/* Glass Back Button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.875rem', fontWeight: 600, color: '#64748b',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            padding: '10px 16px',
            cursor: 'pointer', marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(30, 41, 59, 0.04)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = '#0ea5e9';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(14, 165, 233, 0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = '#64748b';
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(30, 41, 59, 0.04)';
          }}
        >
          <ChevronLeft size={15} />
          All Courses
        </button>

        {/* Course Header with Glass Card */}
        <div className="glass-card" style={{
          borderRadius: '24px',
          padding: '28px 32px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Background accent glow */}
          <div style={{
            position: 'absolute', top: '-50%', right: '-10%', width: '250px', height: '250px',
            background: `radial-gradient(circle, ${course.accentColor}15 0%, transparent 70%)`,
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', position: 'relative' }}>
            <div style={{
              flexShrink: 0, width: '72px', height: '72px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '20px',
              background: `linear-gradient(135deg, ${course.accentColor}20, ${course.accentColor}05)`,
              border: `1px solid ${course.accentColor}30`,
              fontSize: '34px',
              boxShadow: `0 10px 30px ${course.accentColor}25`,
            }}>
              {course.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                {course.title}
              </h1>
              <p style={{ fontSize: '0.9375rem', color: '#64748b', marginBottom: '16px', lineHeight: 1.6 }}>
                {course.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem' }}>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#475569', fontWeight: 600,
                }}>
                  <BookOpen size={13} />
                  {course.lessons.length} lessons
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: '#475569', fontWeight: 600,
                }}>
                  <Clock size={13} />
                  ~{totalMins} min total
                </span>
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 14px', borderRadius: '12px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  color: '#16a34a', fontWeight: 600,
                }}>
                  <CheckCircle size={13} />
                  Free access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Label */}
        <p style={{
          fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#94a3b8', marginBottom: '16px',
        }}>
          Course Content
        </p>

        {/* Glass Lesson Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {course.lessons.map((lesson, index) => (
            <button
              key={lesson.id}
              onClick={() => navigate(`/course/${courseId}/lesson/${lesson.id}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                padding: '16px 20px',
                textAlign: 'left', cursor: 'pointer',
                width: '100%',
                boxShadow: '0 2px 12px rgba(30, 41, 59, 0.03)',
                transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.01)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(30, 41, 59, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.6) inset';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.7)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.65)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(30, 41, 59, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              }}
            >
              <div style={{
                flexShrink: 0, width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '12px',
                background: `${course.accentColor}15`,
                border: `1px solid ${course.accentColor}25`,
                fontSize: '0.8125rem', fontWeight: 800, color: course.accentColor,
              }}>
                {String(index + 1).padStart(2, '0')}
              </div>
              <p style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 600, color: '#1e293b' }}>
                {lesson.title}
              </p>
              <span style={{
                display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '0.75rem', color: '#94a3b8', flexShrink: 0,
                padding: '6px 12px', borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.5)',
              }}>
                <Clock size={11} />
                {lesson.duration}
              </span>
              <PlayCircle size={22} color={course.accentColor} style={{ flexShrink: 0, opacity: 0.7 }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
