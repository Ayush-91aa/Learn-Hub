import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAllProgress } from '../utils/progressUtils';
import { courses } from '../data/courseData';
import { BookOpen, Clock, Trophy, ArrowRight, TrendingUp, ChevronLeft } from 'lucide-react';

const wrap = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: '24px',
  paddingRight: '24px',
  paddingTop: '100px',
  paddingBottom: '80px',
};

/* Circular Progress Ring */
function ProgressRing({ progress, size = 80, strokeWidth = 6, color = '#0ea5e9' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(14, 165, 233, 0.1)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.2, fontWeight: 800, color: '#1e293b',
      }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const courseIds = courses.map(c => c.id);
      getAllProgress(user.uid, courseIds).then(p => {
        setProgress(p);
        setLoading(false);
      });
    }
  }, [user]);

  const totalLessons = courses.reduce((acc, c) => acc + c.lessons.length, 0);
  const totalCompleted = Object.values(progress).reduce(
    (acc, p) => acc + (p.completedLessons?.length || 0), 0
  );
  const coursesStarted = Object.values(progress).filter(
    p => (p.completedLessons?.length || 0) > 0
  ).length;
  const overallPercent = totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            border: '3px solid rgba(14, 165, 233, 0.2)',
            borderTopColor: '#0ea5e9',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading your progress...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ width: '100%', minHeight: '100vh' }}>
      <div style={wrap}>

        {/* Back */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '0.875rem', fontWeight: 600, color: '#64748b',
          background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '12px',
          padding: '10px 16px', cursor: 'pointer', marginBottom: '28px',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#0ea5e9'; e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}
        >
          <ChevronLeft size={15} /> Back to Courses
        </button>

        {/* Profile Card */}
        <div className="glass-card" style={{
          borderRadius: '28px', padding: '32px',
          marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '24px',
          flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-50%', right: '-10%', width: '300px', height: '300px',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <img
            src={user?.photoURL}
            alt={user?.displayName}
            referrerPolicy="no-referrer"
            style={{
              width: '80px', height: '80px', borderRadius: '22px',
              border: '3px solid rgba(14, 165, 233, 0.2)',
              boxShadow: '0 8px 24px rgba(30, 41, 59, 0.1)',
            }}
          />
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>
              {user?.displayName}
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '4px' }}>{user?.email}</p>
          </div>
          <ProgressRing progress={overallPercent} size={90} strokeWidth={7} />
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px', marginBottom: '32px',
        }}>
          {[
            { label: 'Lessons Done', value: totalCompleted, icon: BookOpen, color: '#0ea5e9' },
            { label: 'Courses Started', value: coursesStarted, icon: TrendingUp, color: '#10b981' },
            { label: 'Total Courses', value: courses.length, icon: Trophy, color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{
              borderRadius: '20px', padding: '24px',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '14px',
                background: `${stat.color}15`, border: `1px solid ${stat.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon size={22} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{stat.value}</p>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Course Progress Cards */}
        <h2 style={{
          fontSize: '1.125rem', fontWeight: 800, color: '#1e293b',
          marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9' }} />
          Course Progress
        </h2>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px',
        }}>
          {courses.map(course => {
            const cp = progress[course.id] || { completedLessons: [] };
            const done = cp.completedLessons?.length || 0;
            const total = course.lessons.length;
            const pct = total > 0 ? (done / total) * 100 : 0;

            return (
              <button
                key={course.id}
                onClick={() => navigate(`/course/${course.id}`)}
                className="glass-card"
                style={{
                  borderRadius: '20px', padding: '24px',
                  textAlign: 'left', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '20px',
                  transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 48px rgba(30, 41, 59, 0.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px',
                  background: `${course.accentColor}15`, border: `1px solid ${course.accentColor}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '24px', flexShrink: 0,
                }}>
                  {course.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    {course.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                      {done}/{total} lessons
                    </span>
                    {done === total && total > 0 && (
                      <span style={{
                        fontSize: '0.65rem', fontWeight: 700, color: '#10b981',
                        background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px',
                      }}>COMPLETED</span>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div style={{
                    height: '6px', borderRadius: '3px',
                    background: 'rgba(14, 165, 233, 0.1)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '3px',
                      background: `linear-gradient(90deg, ${course.accentColor}, ${course.accentColor}cc)`,
                      width: `${pct}%`,
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
                <ArrowRight size={18} color="#94a3b8" style={{ flexShrink: 0 }} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
