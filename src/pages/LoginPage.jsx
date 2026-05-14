import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await login();
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%', left: '15%',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%', right: '15%',
        width: '250px', height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* Login Card */}
      <div className="page-enter" style={{
        width: '100%',
        maxWidth: '440px',
        borderRadius: '32px',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.7)',
        boxShadow: '0 32px 80px rgba(30, 41, 59, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        padding: '48px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
          background: 'linear-gradient(90deg, transparent, #0ea5e9, #6366f1, transparent)',
        }} />

        {/* Logo */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '22px',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 12px 36px rgba(14, 165, 233, 0.35), 0 0 0 4px rgba(255, 255, 255, 0.8), 0 0 0 5px rgba(14, 165, 233, 0.15)',
        }}>
          <BookOpen size={32} color="#fff" />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.03em',
          marginBottom: '8px',
        }}>
          <span style={{ color: '#1e293b' }}>Learn</span>
          <span style={{
            background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Hub</span>
        </h1>

        <p style={{
          fontSize: '0.9375rem', color: '#64748b', lineHeight: 1.6,
          marginBottom: '36px', maxWidth: '300px', margin: '0 auto 36px',
        }}>
          Sign in to start learning, track your progress, and master coding.
        </p>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '20px',
          background: 'rgba(14, 165, 233, 0.08)',
          border: '1px solid rgba(14, 165, 233, 0.15)',
          fontSize: '0.75rem', fontWeight: 600, color: '#0ea5e9',
          marginBottom: '28px',
        }}>
          <Sparkles size={12} />
          AI-Powered Learning Platform
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '12px', width: '100%', padding: '16px 24px',
            borderRadius: '16px', border: '1px solid rgba(30, 41, 59, 0.1)',
            cursor: isLoading ? 'wait' : 'pointer',
            background: '#fff',
            fontSize: '1rem', fontWeight: 700, color: '#1e293b',
            boxShadow: '0 4px 16px rgba(30, 41, 59, 0.08)',
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
            opacity: isLoading ? 0.7 : 1,
          }}
          onMouseEnter={e => {
            if (!isLoading) {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 28px rgba(30, 41, 59, 0.12)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(30, 41, 59, 0.08)';
          }}
        >
          {/* Google icon SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          {isLoading ? 'Signing in...' : 'Continue with Google'}
        </button>

        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '16px', fontWeight: 500 }}>
            {error}
          </p>
        )}

        {/* Footer text */}
        <p style={{
          fontSize: '0.75rem', color: '#94a3b8', marginTop: '28px', lineHeight: 1.6,
        }}>
          By signing in, you agree to our terms of service.
          <br />Your data is stored securely on Firebase.
        </p>
      </div>
    </div>
  );
}
