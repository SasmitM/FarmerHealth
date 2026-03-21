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
      >
        <ToggleButton value="risk">Risk</ToggleButton>
        <ToggleButton value="symptoms">Symptoms</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default App;
