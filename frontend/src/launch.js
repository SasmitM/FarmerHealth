import React from 'react';
import { useNavigate } from 'react-router-dom';

function Launch() {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Navigate to /main when user scrolls down more than 100px
      if (scrollTop > 100) {
        navigate('/main');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navigate]);

  return (
    <div style={{ height: '200vh', paddingTop: '50px' }}>
      <h1>New Page</h1>
      <p>Scroll down to continue to the app...</p>
    </div>
  );
}

export default Launch;