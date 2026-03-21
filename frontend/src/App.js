import './App.css';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';

function App() {
  const [alignment, setAlignment] = React.useState('risk');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
          }}
          role="presentation"
        >
          <Typography variant="h5" sx={{ color: '#1f3b4f', mb: 1 }}>
            FarmerBot
          </Typography>
          <Typography sx={{ color: '#1f3b4f' }}>
            Chat sidebar ready.
          </Typography>
        </Box>
      </Drawer>
    </div>
  );
}

export default App;
