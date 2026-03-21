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
            textTransform: 'none',
          },
          '& .Mui-selected': {
            backgroundColor: '#ecaf9a',
            color: '#1f3b4f',
          },
          '& .Mui-selected:hover': {
            backgroundColor: '#d4956a',
          },
        }}
      >
        <ToggleButton value="risk" sx={{ fontFamily: "'Afacad', sans-serif" }}>Risk</ToggleButton>
        <ToggleButton value="symptoms" sx={{ fontFamily: "'Afacad', sans-serif" }}>Symptoms</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default App;
