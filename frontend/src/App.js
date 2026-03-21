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
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Launch from './launch.js';

function App() {
  const [alignment, setAlignment] = React.useState('risk');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [farmerTypeAnchor, setFarmerTypeAnchor] = React.useState(null);
  const [farmerType, setFarmerType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [symptomSessionId, setSymptomSessionId] = React.useState(null);
  const [symptomMessage, setSymptomMessage] = React.useState('');
  const [symptomHistory, setSymptomHistory] = React.useState([
    {
      role: 'assistant',
      content: 'Tell me your symptoms and what farm activity happened recently.',
    },
  ]);
  const [symptomActionLevel, setSymptomActionLevel] = React.useState(null);
  const [isSymptomLoading, setIsSymptomLoading] = React.useState(false);


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

  const symptomContextChips = [
    'spraying',
    'animal contact',
    'machinery use',
    'chemical exposure',
    'dust exposure',
    'recent injury',
  ];

  const handleAddSymptomContext = (contextText) => {
    setSymptomMessage((prev) => (prev ? `${prev}, ${contextText}` : contextText));
  };

  const handleSymptomSend = async () => {
    const trimmedMessage = symptomMessage.trim();
    if (!trimmedMessage) {
      return;
    }

    try {
      setIsSymptomLoading(true);

      let sessionId = symptomSessionId;

      if (!sessionId) {
        const sessionRes = await fetch('/api/symptoms/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!sessionRes.ok) throw new Error('Failed to create session');
        const sessionData = await sessionRes.json();
        sessionId = sessionData.session_id;
        setSymptomSessionId(sessionId);
      }

      const updatedHistory = [...symptomHistory, { role: 'user', content: trimmedMessage }];
      setSymptomHistory(updatedHistory);
      setSymptomMessage('');

      const messageRes = await fetch(`/api/symptoms/session/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmedMessage,
          history: symptomHistory,
        }),
      });

      if (!messageRes.ok) throw new Error('Failed to send message');
      const messageData = await messageRes.json();

      setSymptomHistory((prev) => [
        ...prev,
        { role: 'assistant', content: messageData.response },
      ]);

      if (messageData.action_level) {
        setSymptomActionLevel(messageData.action_level);
      }
    } catch (error) {
      console.error('Symptom chat error:', error);
      setSymptomHistory((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Could not process message. Please try again.' },
      ]);
    } finally {
      setIsSymptomLoading(false);
    }
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
    <Router>
      <div className="App">
        <nav className="navbar">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>FarmerHealth</h1>
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Launch />} />
          <Route path="/main" element={<>
            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
              sx={{
                border: '2px solid #8f7c63',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: '#f7f3ee',
                width: 'fit-content',
                margin: '0 auto',
                '& .MuiToggleButtonGroup-grouped': {
                  margin: 0,
                  border: 0,
                  borderRadius: 0,
                },
                '& .MuiToggleButtonGroup-grouped:not(:last-of-type)': {
                  borderRight: '2px solid #8f7c63',
                },
                '& .MuiToggleButton-root': {
                  fontFamily: "'Afacad', sans-serif",
                  color: '#59775e',
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
                    color: '#59775e',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#ecaf9a',
                  },
                  '&.Mui-selected.Mui-focusVisible': {
                    backgroundColor: '#ecaf9a',
                  },
                  '&.Mui-selected:active': {
                    backgroundColor: '#ecaf9a',
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
                    color: '#59775e',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: '#ecaf9a',
                  },
                  '&.Mui-selected.Mui-focusVisible': {
                    backgroundColor: '#ecaf9a',
                  },
                  '&.Mui-selected:active': {
                    backgroundColor: '#ecaf9a',
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
                  <div className="card-top">Farming Information</div>
                  <div className="card-body">
                    <label>Type of Farmer</label>
                    <Button
                      variant="outlined"
                      onClick={handleFarmerTypeOpen}
                      sx={{
                        justifyContent: 'space-between',
                        width: '100%',
                        borderColor: '#8f7c63',
                        color: '#59775e',
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
                            color: '#59775e',
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
                            color: '#59775e',
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
                <div className="form-card">
                  <div className="card-top">Symptoms Chat</div>
                  <div className="card-body">
                    {symptomActionLevel && (
                      <div
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          backgroundColor:
                            symptomActionLevel === 'call_911'
                              ? '#ffcccc'
                              : symptomActionLevel === 'er'
                                ? '#ffe6cc'
                                : symptomActionLevel === 'urgent_care'
                                  ? '#ffffcc'
                                  : '#ccffcc',
                          color:
                            symptomActionLevel === 'call_911'
                              ? '#cc0000'
                              : symptomActionLevel === 'er'
                                ? '#cc6600'
                                : symptomActionLevel === 'urgent_care'
                                  ? '#cccc00'
                                  : '#00cc00',
                          fontWeight: 600,
                          marginBottom: '8px',
                        }}
                      >
                        Alert Level: {symptomActionLevel.toUpperCase()}
                      </div>
                    )}

                    <label>Conversation</label>
                    <div className="symptom-chat-window">
                      {symptomHistory.map((entry, index) => (
                        <div
                          key={`${entry.role}-${index}`}
                          className={`chat-bubble ${entry.role === 'user' ? 'chat-user' : 'chat-assistant'}`}
                        >
                          <strong>{entry.role === 'user' ? 'You' : 'Assistant'}:</strong> {entry.content}
                        </div>
                      ))}
                    </div>

                    <label htmlFor="symptom-message">Message</label>
                    <textarea
                      id="symptom-message"
                      rows="4"
                      value={symptomMessage}
                      onChange={(event) => setSymptomMessage(event.target.value)}
                      placeholder="Example: I have a cough and headache after spraying yesterday."
                      disabled={isSymptomLoading}
                    />

                    <label>Quick Context</label>
                    <div className="context-chip-row">
                      {symptomContextChips.map((chip) => (
                        <Button
                          key={chip}
                          variant="outlined"
                          type="button"
                          onClick={() => handleAddSymptomContext(chip)}
                          disabled={isSymptomLoading}
                          sx={{
                            fontFamily: "'Afacad', sans-serif",
                            textTransform: 'none',
                            borderColor: '#8f7c63',
                            color: '#59775e',
                            backgroundColor: '#fff9f2',
                            borderRadius: '999px',
                            px: 1.5,
                            py: 0.4,
                          }}
                        >
                          {chip}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="contained"
                      type="button"
                      sx={submitButtonSx}
                      onClick={handleSymptomSend}
                      disabled={isSymptomLoading}
                    >
                      {isSymptomLoading ? 'Sending...' : 'Send Message'}
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
                <Typography variant="h5" sx={{ color: '#1f3b4f', mb: 1 }}>
                  FarmerBot
                </Typography>
                <Typography sx={{ color: '#1f3b4f' }}>
                  Chat sidebar ready.
                </Typography>
                <Box sx={{
                  display: 'flex',
                  gap: 1,
                  alignItems: 'flex-end',
                  mt: 2,
                  position: 'absolute',
                  bottom: 24,
                  left: 24,
                  right: 24,
                }}>
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
          </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
