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
      <h1>FarmerHealth</h1>
      <ToggleButtonGroup
        color="primary"
        value={alignment}
        exclusive
        onChange={handleChange}
        aria-label="Platform"
        sx={{ '& button': { fontFamily: "'Afacad', sans-serif" } }}
      >
        <ToggleButton value="risk" sx={{ fontFamily: "'Afacad', sans-serif" }}>Risk</ToggleButton>
        <ToggleButton value="symptoms" sx={{ fontFamily: "'Afacad', sans-serif" }}>Symptoms</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default App;
