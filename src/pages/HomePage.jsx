import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courseData';
import { ArrowRight, Star, Users } from 'lucide-react';

const stats = [
    { label: 'Video Lessons', value: '44+' },
    { label: 'Topics Covered', value: '6' },
    { label: 'Free Forever', value: '100%' },
];

const centerContainer = {
    width: '100%',
    maxWidth: '1152px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
};

const heroContainer = {
    width: '100%',
    maxWidth: '720px',
    marginLeft: 'auto',
    marginRight: 'auto',
    textAlign: 'center',
};

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100%' }}>

            {/* ── Hero ── */}
            <section style={{ position: 'relative', overflow: 'hidden', paddingTop: '80px', paddingBottom: '64px' }}>
                {/* Glow blobs */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
                    <div style={{ width: '700px', height: '400px', borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(120px)' }} />
                </div>

                <div style={{ ...heroContainer, position: 'relative', zIndex: 1 }}>
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', borderRadius: '9999px', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.1)', padding: '6px 16px', marginBottom: '24px' }}>
                        <Star size={11} color="#818cf8" fill="#818cf8" />
                        <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#818cf8' }}>
                            Free Courses · No Sign-up Required
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', color: '#fff', marginBottom: '20px' }}>
                        The Fastest Way to{' '}
                        <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa, #67e8f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                            Master Coding
                        </span>
                    </h1>

                    {/* Subheading */}
                    <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: '#94a3b8', maxWidth: '520px', margin: '0 auto 40px' }}>
                        Structured video courses for Python, C++, AI, and web technologies.
                        Learn at your own pace — from zero to confident.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '48px' }}>
                        {stats.map((s) => (
                            <div key={s.label} style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{s.value}</p>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Course Grid ── */}
            <section style={{ ...centerContainer, paddingBottom: '96px' }}>
                {/* Section header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>All Courses</h2>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{courses.length} available</span>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {courses.map((course) => (
                        <button
                            key={course.id}
                            onClick={() => navigate(`/course/${course.id}`)}
                            className="card-float group"
                            style={{
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.07)',
                                background: 'rgba(255,255,255,0.03)',
                                padding: '24px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                transition: 'transform 0.25s ease, border-color 0.25s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.35)'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                        >
                            {/* Icon */}
                            <div style={{
                                marginBottom: '20px',
                                display: 'inline-flex',
                                height: '56px',
                                width: '56px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '14px',
                                background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                                fontSize: '24px',
                            }}>
                                {course.icon}
                            </div>

                            {/* Title */}
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{course.title}</h3>
                            {/* Description */}
                            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#94a3b8', marginBottom: '24px', flex: 1 }}>{course.description}</p>

                            {/* Footer */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
                                    <Users size={12} color="#64748b" />
                                    {course.lessons.length} lessons
                                </div>
                                <span style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    borderRadius: '9999px',
                                    background: `linear-gradient(135deg, ${course.gradientFrom}, ${course.gradientTo})`,
                                    padding: '6px 14px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    color: '#fff',
                                }}>
                                    Start <ArrowRight size={11} />
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
