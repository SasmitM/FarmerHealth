import React from 'react';
import { useNavigate } from 'react-router-dom';

function Launch() {
  const navigate = useNavigate();
  const prevScrollRef = React.useRef(0);

  React.useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollDirection = scrollTop > prevScrollRef.current ? 'down' : 'up';
      prevScrollRef.current = scrollTop;

      if (scrollDirection === 'down' && scrollTop > 100) {
        navigate('/main');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [navigate]);

  const handleScrollClick = () => {
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div style={{ height: '200vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 40px 40px' }}>

      {/* Title */}
      <div>
        <h1 style={{ fontFamily: "'Afacad', sans-serif", color: '#59775e', fontSize: '3.5rem', margin: 0, lineHeight: 1.1 }}>
          Farmer<br />Health
        </h1>
        <p style={{ fontFamily: "'Afacad', sans-serif", color: '#8f7c63', fontSize: '1.1rem', marginTop: '16px', maxWidth: '360px', lineHeight: 1.6 }}>
          Health information built for rural farmers. Understand your risks, check your symptoms, and know when to act.
        </p>
      </div>

      {/* Floating scroll hint */}
      <div
        onClick={handleScrollClick}
        style={{
          position: 'fixed',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          animation: 'floatBounce 1.8s ease-in-out infinite',
        }}
      >
        <p style={{ fontFamily: "'Afacad', sans-serif", color: '#8f7c63', fontSize: '1rem', margin: 0 }}>
          Scroll down to get started
        </p>
        <span style={{ fontSize: '1.4rem', color: '#59775e' }}>↓</span>
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes floatBounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
      `}</style>
    </div>
    
  );
}

export default Launch;