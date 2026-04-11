import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courses } from '../data/courseData';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight, Sparkles, Code2, Terminal, Cpu } from 'lucide-react';

const wrap = {
  width: '100%',
  maxWidth: '1200px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: '24px',
  paddingRight: '24px',
};

const adSlides = [
  { image: '/banners/ad4.png', alt: 'Google Maps Scraping Guide' },
  { image: '/banners/ad5.png', alt: 'Famous Websites Built with Python' },
  { image: '/banners/python_code.png', alt: 'Python Programming' },
];

/* ── Animated Gradient Text Component ── */
function AnimatedGradientText({ children }) {
  return (
    <span
      className="animated-gradient-text"
      style={{
        background: 'linear-gradient(90deg, #0ea5e9, #06b6d4, #10b981, #0ea5e9)',
        backgroundSize: '300% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        animation: 'gradientFlow 4s ease infinite',
        display: 'inline-block',
      }}
    >
      {children}
    </span>
  );
}

/* ── Typewriter Effect Component ── */
function TypewriterText({ text, delay = 0 }) {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!hasStarted) return;
    if (displayText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, displayText.length + 1));
      }, 40 + Math.random() * 30);
      return () => clearTimeout(timeout);
    } else {
      // Blink cursor after typing is done
      const blinkInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 530);
      return () => clearInterval(blinkInterval);
    }
  }, [displayText, hasStarted, text]);

  return (
    <span>
      {displayText}
      <span
        style={{
          opacity: showCursor ? 1 : 0,
          color: '#0ea5e9',
          fontWeight: 500,
          transition: 'opacity 0.1s ease',
        }}
      >
        |
      </span>
    </span>
  );
}

/* ── 3D Rotating Carousel ── */
function Carousel3D() {
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % adSlides.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (index) => {
    setCurrent(index);
    startTimer();
  };

  const next = () => goTo((current + 1) % adSlides.length);
  const prev = () => goTo((current - 1 + adSlides.length) % adSlides.length);

  const handleDragStart = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX || e.touches?.[0]?.clientX);
    clearInterval(timerRef.current);
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    setDragOffset(clientX - dragStart);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragOffset) > 100) {
      if (dragOffset > 0) prev();
      else next();
    }
    setDragOffset(0);
    startTimer();
  };

  return (
    <div className="glass-card" style={{ borderRadius: '24px', overflow: 'hidden', padding: '0' }}>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          perspective: '1200px',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          touchAction: 'pan-y',
        }}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <style>{`
          @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes floatCard {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
        {adSlides.map((slide, i) => {
          const offset = i - current;
          const isActive = i === current;
          const absOffset = Math.abs(offset);
          const isVisible = absOffset <= 1;

          if (!isVisible && !isActive) return null;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                transform: `
                  translateX(${offset * 60 + (isDragging ? dragOffset * 0.3 : 0)}%)
                  rotateY(${offset * -35 + (isDragging ? dragOffset * -0.05 : 0)}deg)
                  scale(${isActive ? 1 : 0.85 - absOffset * 0.15})
                  ${isActive ? 'translateZ(100px)' : `translateZ(${-absOffset * 100}px)`}
                `,
                opacity: isActive ? 1 : 0.6 - absOffset * 0.2,
                zIndex: isActive ? 10 : 10 - absOffset,
                transition: isDragging ? 'none' : 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: isActive
                  ? '0 25px 80px rgba(30, 41, 59, 0.25), 0 0 0 1px rgba(255,255,255,0.5) inset'
                  : '0 10px 30px rgba(30, 41, 59, 0.1)',
                background: '#f8fafc',
              }}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                draggable={false}
              />
              {/* Shine effect on active slide */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, transparent 50%)',
                    animation: 'shine 3s ease-in-out infinite',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>
          );
        })}

        {/* Glass arrow buttons */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '16px',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(30, 41, 59, 0.15)',
            zIndex: 20,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(30, 41, 59, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(30, 41, 59, 0.15)';
          }}
        >
          <ChevronLeft size={22} color="#475569" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          style={{
            position: 'absolute',
            top: '50%',
            right: '16px',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.6)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(30, 41, 59, 0.15)',
            zIndex: 20,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(30, 41, 59, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(30, 41, 59, 0.15)';
          }}
        >
          <ChevronRight size={22} color="#475569" />
        </button>

        {/* Modern dots */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 20,
          }}
        >
          {adSlides.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                goTo(i);
              }}
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                background: i === current ? '#0ea5e9' : 'rgba(255,255,255,0.8)',
                transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: i === current ? '0 2px 8px rgba(14, 165, 233, 0.5)' : '0 1px 3px rgba(0,0,0,0.1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Glass Card with Parallax ── */
function GlassCard({ course, onClick, parallaxOffset }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${parallaxOffset - 8}px) scale(1.02)`;
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(${parallaxOffset}px) scale(1)`;
  };

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        padding: '28px',
        textAlign: 'left',
        cursor: 'pointer',
        boxShadow: isHovered
          ? '0 24px 60px rgba(30, 41, 59, 0.12), 0 8px 24px rgba(30, 41, 59, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          : '0 4px 20px rgba(30, 41, 59, 0.05), 0 1px 4px rgba(30, 41, 59, 0.03), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
        transform: `translateY(${parallaxOffset}px)`,
        transition: 'transform 0.15s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Subtle top glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
          borderRadius: '20px 20px 0 0',
        }}
      />

      {/* Animated top border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${course.accentColor}, transparent)`,
          borderRadius: '24px 24px 0 0',
          opacity: 0.8,
        }}
      />

      {/* Icon with floating animation */}
      <div
        style={{
          marginBottom: '20px',
          width: '60px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '18px',
          background: `linear-gradient(135deg, ${course.accentColor}22, ${course.accentColor}10)`,
          fontSize: '26px',
          border: `1px solid ${course.accentColor}30`,
          boxShadow: `0 8px 24px ${course.accentColor}25, 0 0 0 1px rgba(255,255,255,0.3) inset`,
          transform: 'translateZ(25px)',
          transition: 'transform 0.3s ease',
        }}
      >
        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{course.icon}</span>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: 800,
          color: '#1e293b',
          marginBottom: '8px',
          transform: 'translateZ(20px)',
          letterSpacing: '-0.02em',
        }}
      >
        {course.title}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: '0.875rem',
          lineHeight: 1.7,
          color: '#64748b',
          marginBottom: '24px',
          flex: 1,
          transform: 'translateZ(15px)',
        }}
      >
        {course.description}
      </p>

      {/* Footer with glass pill */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'translateZ(18px)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.75rem',
            color: '#94a3b8',
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'rgba(255,255,255,0.5)',
          }}
        >
          <BookOpen size={13} />
          {course.lessons.length} lessons
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            padding: '10px 18px',
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#fff',
            boxShadow: !isHovered ? '0 4px 14px rgba(14, 165, 233, 0.35)' : '0 8px 24px rgba(14, 165, 233, 0.45)',
            transition: 'all 0.3s ease',
            transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
          }}
        >
          Start <ArrowRight size={14} />
        </span>
      </div>
    </button>
  );
}

/* ── Decorative floating shapes ── */
function FloatingShapes() {
  const shapes = [
    { Icon: Code2, delay: '0s', x: '10%', y: '20%', color: '#0ea5e920', size: 60 },
    { Icon: Terminal, delay: '2s', x: '85%', y: '15%', color: '#10b98120', size: 48 },
    { Icon: Cpu, delay: '4s', x: '75%', y: '60%', color: '#06b6d420', size: 72 },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {shapes.map((shape, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: shape.x,
            top: shape.y,
            opacity: 0.6,
            animation: `floatShape 6s ease-in-out ${shape.delay} infinite`,
          }}
        >
          <shape.Icon
            size={shape.size}
            color={shape.color}
            style={{ filter: 'blur(1px)' }}
          />
        </div>
      ))}
      <style>{`
        @keyframes floatShape {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

/* ── HomePage with all enhancements ── */
export default function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        // Calculate how far into the section we've scrolled (0 to 1)
        const progress = Math.max(0, Math.min(1, -sectionTop / (sectionHeight - window.innerHeight)));
        setScrollY(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax offsets based on card position
  const getParallaxOffset = (index, totalCards) => {
    const row = Math.floor(index / 3); // Approximate row
    return scrollY * (20 + row * 10);
  };

  return (
    <div className="page-enter" style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <FloatingShapes />

      {/* ── Hero Section ── */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '40px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          {/* Glass badge with shimmer */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '30px',
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#0ea5e9',
              marginBottom: '24px',
              boxShadow: '0 4px 16px rgba(30, 41, 59, 0.08)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
                transform: 'translateX(-100%)',
                animation: 'shimmer 3s infinite',
              }}
            />
            <Sparkles size={16} />
            <span style={{ position: 'relative', zIndex: 1 }}>Learn without limits</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#1e293b',
              marginBottom: '20px',
            }}
          >
            Welcome to{' '}
            <span style={{ display: 'inline-block' }}>
              <AnimatedGradientText>LearnHub</AnimatedGradientText>
            </span>
          </h1>

          {/* Typewriter tagline */}
          <p
            style={{
              fontSize: '1.125rem',
              color: '#64748b',
              lineHeight: 1.7,
              maxWidth: '600px',
              margin: '0 auto 16px',
              minHeight: '2.5em',
            }}
          >
            <TypewriterText
              text="Master programming with interactive lessons, AI-powered tutoring, and beautiful course content."
              delay={800}
            />
          </p>
        </div>
      </section>

      {/* ── 3D Rotating Carousel ── */}
      <section style={{ width: '100%', paddingTop: '20px', paddingBottom: '50px', position: 'relative', zIndex: 1 }}>
        <div style={{ ...wrap }}>
          <Carousel3D />
        </div>
      </section>

      {/* ── Course Grid with parallax cards ── */}
      <section ref={sectionRef} style={{ ...wrap, paddingBottom: '100px', position: 'relative', zIndex: 1 }}>
        {/* Section header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px',
            padding: '16px 24px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#1e293b',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0ea5e9, #10b981)',
              }}
            />
            All Courses
          </h2>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 }}>
            {courses.length} courses available
          </span>
        </div>

        {/* Grid with parallax */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {courses.map((course, index) => (
            <GlassCard
              key={course.id}
              course={course}
              onClick={() => navigate(`/course/${course.id}`)}
              parallaxOffset={getParallaxOffset(index, courses.length)}
            />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
