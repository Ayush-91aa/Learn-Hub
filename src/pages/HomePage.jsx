import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courseData';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

const wrap = {
    width: '100%',
    maxWidth: '1152px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
};

/* ── Ad Carousel ── */
const adSlides = [
    { image: '/banners/ad4.png', alt: 'Google Maps Scraping Guide' },
    { image: '/banners/ad5.png', alt: 'Famous Websites Built with Python' },
    { image: '/banners/python_code.png', alt: 'Python Programming' },
];

function AdCarousel() {
    const [current, setCurrent] = useState(0);
    const timerRef = useRef(null);

    const startTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent((prev) => (prev + 1) % adSlides.length);
        }, 4000);
    };

    useEffect(() => {
        startTimer();
        return () => clearInterval(timerRef.current);
    }, []);

    const goTo = (index) => {
        setCurrent(index);
        startTimer();
    };

    const prev = () => goTo((current - 1 + adSlides.length) % adSlides.length);
    const next = () => goTo((current + 1) % adSlides.length);

    return (
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
            {/* Slides */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 5', backgroundColor: '#f0f0f0' }}>
                {adSlides.map((slide, i) => (
                    <img
                        key={i}
                        src={slide.image}
                        alt={slide.alt}
                        style={{
                            position: 'absolute', inset: 0,
                            width: '100%', height: '100%',
                            objectFit: 'cover',
                            opacity: i === current ? 1 : 0,
                            transition: 'opacity 0.6s ease',
                        }}
                    />
                ))}
            </div>

            {/* Arrow buttons */}
            <button onClick={prev} style={{
                position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.15s',
            }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
                <ChevronLeft size={18} color="#333" />
            </button>
            <button onClick={next} style={{
                position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)',
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)', border: '1px solid #e0e0e0',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.15s',
            }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
            >
                <ChevronRight size={18} color="#333" />
            </button>

            {/* Dots */}
            <div style={{ position: 'absolute', bottom: '14px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                {adSlides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        style={{
                            width: i === current ? '24px' : '8px', height: '8px',
                            borderRadius: '4px', border: 'none', cursor: 'pointer',
                            backgroundColor: i === current ? '#008080' : 'rgba(255,255,255,0.7)',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

/* ── 3D tilt card ── */
function Card3D({ course, onClick }) {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    };

    const handleMouseLeave = () => {
        cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)';
    };

    return (
        <button
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                position: 'relative',
                display: 'flex', flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '20px',
                background: '#fff',
                border: '1px solid #e0e0e0',
                padding: '28px',
                textAlign: 'left',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
                transition: 'transform 0.15s ease-out, box-shadow 0.3s ease',
                transformStyle: 'preserve-3d',
            }}
        >
            {/* Colored top strip */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                backgroundColor: '#008080',
                borderRadius: '20px 20px 0 0',
            }} />

            {/* Icon */}
            <div style={{
                marginBottom: '20px',
                width: '56px', height: '56px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '16px',
                backgroundColor: course.accentColor,
                fontSize: '24px',
                boxShadow: `0 6px 20px ${course.accentColor}40`,
                transform: 'translateZ(20px)',
            }}>
                {course.icon}
            </div>

            {/* Title */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#333', marginBottom: '8px', transform: 'translateZ(15px)' }}>{course.title}</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#666', marginBottom: '24px', flex: 1, transform: 'translateZ(10px)' }}>{course.description}</p>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#999' }}>
                    <BookOpen size={13} />
                    {course.lessons.length} lessons
                </div>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    borderRadius: '12px',
                    backgroundColor: '#008080',
                    padding: '8px 16px',
                    fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                    boxShadow: '0 4px 14px rgba(0,128,128,0.3)',
                }}>
                    Start <ArrowRight size={13} />
                </span>
            </div>
        </button>
    );
}

/* ── HomePage ── */
export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="page-enter" style={{ width: '100%' }}>

            {/* ── Welcome Heading (below logo/navbar) ── */}
            <section style={{ paddingTop: '48px', paddingBottom: '12px', textAlign: 'center' }}>
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#333' }}>
                    Welcome to <span style={{ color: '#008080' }}>LearnHub!</span>
                </h1>
            </section>

            {/* ── Ad Carousel ── */}
            <section style={{ width: '100%', paddingTop: '16px', paddingBottom: '40px' }}>
                <AdCarousel />
            </section>

            {/* ── Course Grid ── */}
            <section style={{ ...wrap, paddingBottom: '80px' }}>
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#333' }}>All Courses</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {courses.map((course) => (
                        <Card3D
                            key={course.id}
                            course={course}
                            onClick={() => navigate(`/course/${course.id}`)}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
