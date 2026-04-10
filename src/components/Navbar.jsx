import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, User } from 'lucide-react';
import { courses } from '../data/courseData';

export default function Navbar() {
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

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
            position: 'sticky', top: 0, zIndex: 50, width: '100%',
            padding: '12px 24px',
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                maxWidth: '1152px', margin: '0 auto',
                padding: '12px 24px',
                borderRadius: '16px',
                background: '#fff',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '12px',
                        backgroundColor: '#008080',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0,128,128,0.2)',
                    }}>
                        <BookOpen size={18} color="#fff" />
                    </div>
                    <span style={{ fontSize: '17px', fontWeight: 800, color: '#333', letterSpacing: '-0.02em' }}>
                        Learn<span style={{ color: '#008080' }}>Hub</span>
                    </span>
                </Link>

                {/* Search */}
                <div style={{ flex: 1, position: 'relative', maxWidth: '380px', margin: '0 auto' }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '10px',
                        borderRadius: '12px',
                        backgroundColor: '#F2F2F2',
                        border: '1px solid #e0e0e0',
                        padding: '9px 14px',
                    }}>
                        <Search size={14} color="#999" style={{ flexShrink: 0 }} />
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="Search courses..."
                            style={{
                                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                                fontSize: '0.875rem', color: '#333',
                            }}
                        />
                        {query && (
                            <button onClick={() => { setQuery(''); setSearchResults([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                <X size={14} color="#999" />
                            </button>
                        )}
                    </div>

                    {/* Search Dropdown */}
                    {searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
                            borderRadius: '14px',
                            background: '#fff',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                            overflow: 'hidden', zIndex: 100,
                            border: '1px solid #e0e0e0',
                        }}>
                            {searchResults.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => handleResultClick(course.id)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        width: '100%', padding: '12px 16px', textAlign: 'left',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#333', fontSize: '0.875rem',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,128,128,0.06)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                >
                                    <span style={{ width: '34px', height: '34px', borderRadius: '10px', backgroundColor: course.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                        {course.icon}
                                    </span>
                                    <div>
                                        <p style={{ fontWeight: 600, color: '#333' }}>{course.title}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#888' }}>{course.lessons.length} lessons</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Profile Icon */}
                <div ref={profileRef} style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        style={{
                            width: '40px', height: '40px', borderRadius: '50%',
                            backgroundColor: profileOpen ? '#008080' : '#F2F2F2',
                            border: '2px solid ' + (profileOpen ? '#008080' : '#e0e0e0'),
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { if (!profileOpen) { e.currentTarget.style.borderColor = '#008080'; e.currentTarget.style.backgroundColor = 'rgba(0,128,128,0.08)'; } }}
                        onMouseLeave={e => { if (!profileOpen) { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.backgroundColor = '#F2F2F2'; } }}
                    >
                        <User size={18} color={profileOpen ? '#fff' : '#666'} />
                    </button>

                    {/* Profile Dropdown */}
                    {profileOpen && (
                        <div style={{
                            position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                            width: '280px',
                            borderRadius: '16px',
                            background: '#fff',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                            overflow: 'hidden', zIndex: 200,
                            animation: 'fadeUp 0.2s ease forwards',
                        }}>
                            {/* Profile Header */}
                            <div style={{
                                padding: '24px 20px 20px',
                                textAlign: 'center',
                                borderBottom: '1px solid #f0f0f0',
                                background: 'linear-gradient(180deg, rgba(0,128,128,0.06) 0%, transparent 100%)',
                            }}>
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    backgroundColor: '#008080',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 12px',
                                    boxShadow: '0 4px 16px rgba(0,128,128,0.25)',
                                    border: '3px solid #fff',
                                }}>
                                    <User size={28} color="#fff" />
                                </div>
                                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#333', marginBottom: '2px' }}>
                                    Ayush Kumar
                                </h3>
                                <p style={{ fontSize: '0.75rem', color: '#999' }}>Student</p>
                            </div>

                            {/* Profile Details */}
                            <div style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: '14px' }}>📱</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', color: '#999', fontWeight: 500, marginBottom: '1px' }}>Phone</p>
                                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#333' }}>+91 98765 43210</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', backgroundColor: '#f2f2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <span style={{ fontSize: '14px' }}>✉️</span>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', color: '#999', fontWeight: 500, marginBottom: '1px' }}>Email</p>
                                        <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#333' }}>ayush.kumar@gmail.com</p>
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
