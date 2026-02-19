import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Zap } from 'lucide-react';
import { courses } from '../data/courseData';

const navWrap = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '1152px',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '24px',
    paddingRight: '24px',
    paddingTop: '12px',
    paddingBottom: '12px',
};

export default function Navbar() {
    const [query, setQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

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
            position: 'sticky', top: 0, zIndex: 50, width: '100%',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: 'rgba(8,12,20,0.92)',
            backdropFilter: 'blur(20px)',
        }}>
            <div style={navWrap}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                    }}>
                        <Zap size={17} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                        Learn<span style={{ color: '#818cf8' }}>Hub</span>
                    </span>
                </Link>

                {/* Search — flex-1, centered between logo and nav */}
                <div style={{ flex: 1, position: 'relative', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        borderRadius: '12px', border: '1px solid rgba(255,255,255,0.09)',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '9px 14px',
                    }}>
                        <Search size={14} color="#64748b" style={{ flexShrink: 0 }} />
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Search courses..."
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                fontSize: '0.875rem', color: '#e2e8f0',
                            }}
                        />
                        {query && (
                            <button onClick={() => { setQuery(''); setSearchResults([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                <X size={14} color="#64748b" />
                            </button>
                        )}
                    </div>

                    {/* Dropdown */}
                    {searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                            borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)',
                            background: '#0f172a', boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                            overflow: 'hidden', zIndex: 100,
                        }}>
                            {searchResults.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => handleResultClick(course.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        width: '100%', padding: '12px 16px', textAlign: 'left',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#cbd5e1', fontSize: '0.875rem',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <span style={{ fontSize: '1.25rem' }}>{course.icon}</span>
                                    <div>
                                        <p style={{ fontWeight: 500, color: '#fff' }}>{course.title}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{course.lessons.length} lessons</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Courses link */}
                <nav>
                    <Link
                        to="/"
                        style={{
                            padding: '8px 16px', borderRadius: '8px',
                            fontSize: '0.875rem', fontWeight: 500,
                            color: '#94a3b8', textDecoration: 'none',
                            transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                    >
                        Courses
                    </Link>
                </nav>
            </div>
        </header>
    );
}
