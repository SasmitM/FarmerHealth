import './App.css';
import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

function App() {
  const [alignment, setAlignment] = React.useState('risk');

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>FarmerHealth</h1>
      </nav>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        sx={{
          '& .MuiToggleButton-root': {
            fontFamily: "'Afacad', sans-serif",
            color: '#1f3b4f',
            borderColor: '#8f7c63',
            backgroundColor: '#f7f3ee',
            textTransform: 'none',
            fontSize: '1.35rem',
            minHeight: 56,
            minWidth: 150,
            padding: '12px 28px',
          },
        }}
      >
        <ToggleButton
          value="risk"
          sx={{
            fontFamily: "'Afacad', sans-serif",
            '&.Mui-selected': {
              backgroundColor: '#ecaf9a',
              color: '#1f3b4f',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#d4956a',
            },
          }}
        >
          Risk
        </ToggleButton>
        <ToggleButton
          value="symptoms"
          sx={{
            fontFamily: "'Afacad', sans-serif",
            '&.Mui-selected': {
              backgroundColor: '#ecaf9a',
              color: '#1f3b4f',
            },
            '&.Mui-selected:hover': {
              backgroundColor: '#d4956a',
            },
          }}
        >
          Symptoms
        </ToggleButton>
      </ToggleButtonGroup>

      {alignment === 'risk' && (
        <div className="risk-form">
          <h2>Risk Form</h2>
  
        </div>
      )}

      {alignment === 'symptoms' && (
        <div className="symptoms-form">
          <h2>Symptoms Form</h2>
    
        </div>
      )}
    </div>
  );
}

export default App;
