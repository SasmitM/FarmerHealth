import './App.css';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

function App() {
  const [alignment, setAlignment] = React.useState('risk');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [farmerTypeAnchor, setFarmerTypeAnchor] = React.useState(null);
  const [farmerType, setFarmerType] = React.useState('');
  const [message, setMessage] = React.useState('');

  const farmTypeOptions = [
    { value: 'crop', label: 'Crop Farmer' },
    { value: 'livestock', label: 'Livestock Farmer' },
    { value: 'mixed', label: 'Mixed Farmer' },
    { value: 'poultry', label: 'Poultry Farmer' },
    { value: 'dairy', label: 'Dairy Farmer' },
    { value: 'aquaculture', label: 'Aquaculture Farmer' },
    { value: 'greenhouse', label: 'Greenhouse / Nursery' },
    { value: 'orchard', label: 'Orchard / Vineyard' },
  ];

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleFarmerTypeOpen = (event) => {
    setFarmerTypeAnchor(event.currentTarget);
  };

  const handleFarmerTypeClose = () => {
    setFarmerTypeAnchor(null);
  };

  const handleFarmerTypeSelect = (value) => {
    setFarmerType(value);
    setFarmerTypeAnchor(null);
  };

  const submitButtonSx = {
    fontFamily: "'Afacad', sans-serif",
    textTransform: 'none',
    backgroundColor: '#59775e',
    fontSize: '1.1rem',
    padding: '10px 18px',
    borderRadius: '10px',
    alignSelf: 'flex-start',
    mt: 1,
  };
  
  const handleSend = () => {
    if (message.trim() === '') return;
    console.log('Sent:', message);
    setMessage('');
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
          <div className="form-card">
            <div className="card-top">Crop + Region Info</div>
            <div className="card-body">
              <label>Type of Farmer</label>
              <Button
                variant="outlined"
                onClick={handleFarmerTypeOpen}
                sx={{
                  justifyContent: 'space-between',
                  width: '100%',
                  borderColor: '#8f7c63',
                  color: '#1f3b4f',
                  backgroundColor: '#fff9f2',
                  textTransform: 'none',
                  fontFamily: "'Afacad', sans-serif",
                  fontSize: '1rem',
                  px: 1.5,
                  py: 1,
                }}
              >
                {farmTypeOptions.find((option) => option.value === farmerType)?.label || 'Type of Farmer'} ▼
              </Button>
              <Menu
                anchorEl={farmerTypeAnchor}
                open={Boolean(farmerTypeAnchor)}
                onClose={handleFarmerTypeClose}
                slotProps={{
                  paper: {
                    sx: {
                      fontFamily: "'Afacad', sans-serif",
                      backgroundColor: '#fff9f2',
                      color: '#1f3b4f',
                      border: '1px solid #8f7c63',
                      boxShadow: 'none',
                      mt: 0.5,
                    },
                  },
                }}
              >
                {farmTypeOptions.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => handleFarmerTypeSelect(option.value)}
                    sx={{
                      fontFamily: "'Afacad', sans-serif",
                      color: '#1f3b4f',
                      '&:hover': { backgroundColor: '#f3debf' },
                    }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Menu>

              <Button variant="contained" type="button" sx={submitButtonSx}>
                Submit
              </Button>

            </div>
          </div>
        </div>
      )}

      {alignment === 'symptoms' && (
        <div className="symptoms-form">
          <h2>Symptoms Form</h2>
          <div className="form-card">
            <div className="card-top">Symptom Summary</div>
            <div className="card-body">
              <label htmlFor="symptom-name">Symptom</label>
              <input id="symptom-name" type="text" placeholder="e.g., yellow leaves" />

              <label htmlFor="symptom-days">Duration (days)</label>
              <input id="symptom-days" type="number" placeholder="e.g., 4" />

              <label htmlFor="symptom-detail">Details</label>
              <textarea id="symptom-detail" rows="4" placeholder="Describe what you see" />

              <Button variant="contained" type="button" sx={submitButtonSx}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}

      <Stack
        direction="row"
        spacing={2}
        sx={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 1200,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setIsSidebarOpen(true)}
          sx={{
            fontFamily: "'Afacad', sans-serif",
            textTransform: 'none',
            backgroundColor: '#59775e',
            fontSize: '1.25rem',
            padding: '12px 22px',
            borderRadius: '12px',
          }}
        >
          FarmerBot 🧑‍🌾
        </Button>
      </Stack>

      <Drawer
        anchor="right"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      >
        <Box
          sx={{
            width: 340,
            height: '100%',
            backgroundColor: '#f3debf',
            p: 3,
            fontFamily: "'Afacad', sans-serif",
            position: 'relative'
          }}
          role="presentation"
        >
          <Typography variant="h5" sx={{ color: '#1f3b4f', mb: 1, fontFamily: "'Afacad'"}}>
            FarmerBot
          </Typography>
          <Typography sx={{ color: '#1f3b4f', fontFamily: "'Afacad'"}}>
            What is your question?
          </Typography>
          <Box sx={{ 
          display: 'flex', 
          gap: 1, 
          alignItems: 'flex-end', 
          mt: 2, 
          position: 'absolute', 
          bottom: 24,          
          left: 24,            
          right: 24, }}>
  <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }}
    placeholder="Type your message..."
    rows={2}
    style={{
      flex: 1,
      resize: 'none',
      border: '1px solid #c4b49a',
      borderRadius: '10px',
      padding: '10px 12px',
      fontFamily: "'Afacad', sans-serif",
      fontSize: '14px',
      color: '#1f3b4f',
      backgroundColor: '#fff',
      outline: 'none',
    }}
  />
  <Button
    onClick={handleSend}
    variant="contained"
    sx={{
      backgroundColor: '#59775e',
      fontFamily: "'Afacad', sans-serif",
      textTransform: 'none',
      borderRadius: '10px',
      height: '44px',
      minWidth: '64px',
    }}
  >
    Send
  </Button>
</Box>
        </Box>
      </Drawer>
    </div>
  );
}

export default App;
