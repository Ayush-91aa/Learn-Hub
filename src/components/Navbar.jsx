import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, User, Sparkles } from 'lucide-react';
import { courses } from '../data/courseData';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // Track scroll for navbar glass effect enhancement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      setSearchResults(courses.filter((c) =>
        c.title.toLowerCase().includes(val.toLowerCase())
      ));
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (id) => {
    setQuery('');
    setSearchResults([]);
    navigate(`/course/${id}`);
  };

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '12px 24px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        maxWidth: '1200px', margin: '0 auto',
        padding: '14px 24px',
        borderRadius: '20px',
        background: isScrolled
          ? 'rgba(255, 255, 255, 0.85)'
          : 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        boxShadow: isScrolled
          ? '0 8px 32px rgba(30, 41, 59, 0.12), 0 2px 8px rgba(30, 41, 59, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5) inset'
          : '0 4px 20px rgba(30, 41, 59, 0.06), 0 1px 4px rgba(30, 41, 59, 0.04), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
        transition: 'all 0.3s ease',
      }}>

        {/* Logo with glass effect */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(14, 165, 233, 0.35), 0 0 0 2px rgba(255,255,255,0.2) inset',
          }}>
            <BookOpen size={18} color="#fff" />
          </div>
          <span style={{
            fontSize: '1.125rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
          }}>
            Learn<span style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Hub</span>
          </span>
        </Link>

        {/* Search with glass input */}
        <div style={{ flex: 1, position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            padding: '10px 16px',
            boxShadow: '0 2px 8px rgba(30, 41, 59, 0.04) inset',
            transition: 'all 0.2s ease',
          }}>
            <Search size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search courses..."
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                fontSize: '0.9rem', color: '#1e293b',
              }}
            />
            {query && (
              <button onClick={() => { setQuery(''); setSearchResults([]); }} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex',
              }}>
                <X size={16} color="#94a3b8" />
              </button>
            )}
          </div>

          {/* Glass Search Dropdown */}
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', left: 0, right: 0,
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 24px 60px rgba(30, 41, 59, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              overflow: 'hidden', zIndex: 100,
              animation: 'fadeUp 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}>
              {searchResults.map((course, index) => (
                <button
                  key={course.id}
                  onClick={() => handleResultClick(course.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    width: '100%', padding: '14px 18px', textAlign: 'left',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#1e293b', fontSize: '0.9rem',
                    borderBottom: index < searchResults.length - 1 ? '1px solid rgba(30, 41, 59, 0.05)' : 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(14, 165, 233, 0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span style={{
                    width: '38px', height: '38px', borderRadius: '12px',
                    background: `linear-gradient(135deg, ${course.accentColor}22, ${course.accentColor}10)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', flexShrink: 0,
                    border: `1px solid ${course.accentColor}30`,
                    boxShadow: `0 4px 12px ${course.accentColor}20`,
                  }}>
                    {course.icon}
                  </span>
                  <div>
                    <p style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.9rem' }}>{course.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>{course.lessons.length} lessons</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile with glass dropdown */}
        <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: profileOpen
                ? 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)'
                : 'rgba(255, 255, 255, 0.6)',
              border: profileOpen ? '2px solid #0ea5e9' : '2px solid rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: profileOpen
                ? '0 6px 20px rgba(14, 165, 233, 0.4)'
                : '0 4px 12px rgba(30, 41, 59, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
              transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
            onMouseEnter={e => {
              if (!profileOpen) {
                e.currentTarget.style.borderColor = '#0ea5e9';
                e.currentTarget.style.background = 'rgba(14, 165, 233, 0.1)';
              }
            }}
            onMouseLeave={e => {
              if (!profileOpen) {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)';
              }
            }}
          >
            <User size={18} color={profileOpen ? '#fff' : '#64748b'} />
          </button>

          {/* Glass Profile Dropdown */}
          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 14px)', right: 0,
              width: '300px',
              borderRadius: '20px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 24px 60px rgba(30, 41, 59, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
              overflow: 'hidden', zIndex: 200,
              animation: 'fadeUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            }}>
              {/* Profile Header with gradient */}
              <div style={{
                padding: '28px 24px 24px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, transparent 100%)',
                position: 'relative',
              }}>
                {/* Subtle top glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.4), transparent)',
                }} />

                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px',
                  boxShadow: '0 8px 28px rgba(14, 165, 233, 0.35), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 0 5px rgba(14, 165, 233, 0.2)',
                }}>
                  <User size={32} color="#fff" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>
                  Ayush Kumar
                </h3>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', borderRadius: '20px',
                  background: 'rgba(14, 165, 233, 0.1)',
                  fontSize: '0.75rem', fontWeight: 600, color: '#0ea5e9',
                }}>
                  <Sparkles size={12} />
                  Student
                </div>
              </div>

              {/* Profile Details with glass items */}
              <div style={{ padding: '20px 24px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px',
                  padding: '12px', borderRadius: '14px',
                  background: 'rgba(14, 165, 233, 0.03)',
                  border: '1px solid rgba(14, 165, 233, 0.08)',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(14, 165, 233, 0.15)',
                  }}>
                    <span style={{ fontSize: '16px' }}>📱</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, marginBottom: '2px' }}>Phone</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>+91 98765 43210</p>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px', borderRadius: '14px',
                  background: 'rgba(14, 165, 233, 0.03)',
                  border: '1px solid rgba(14, 165, 233, 0.08)',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(14, 165, 233, 0.15)',
                  }}>
                    <span style={{ fontSize: '16px' }}>✉️</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, marginBottom: '2px' }}>Email</p>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>ayush.kumar@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
