import './App.css';
import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Drawer from '@mui/material/Drawer';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Launch from './launch.js';
import FirstAid from './firstaid.js';
import useScrollAnimation from './useScrollAnimation';
import Resources from './resources.js';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatWindowRef = React.useRef(null);
  
  // Enable scroll animations
  useScrollAnimation();
  
  const [alignment, setAlignment] = React.useState('risk');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [farmerTypeAnchor, setFarmerTypeAnchor] = React.useState(null);
  const [farmerType, setFarmerType] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [riskSummaryOpen, setRiskSummaryOpen] = React.useState(false);
  const [riskSummary, setRiskSummary] = React.useState('');
  const [isRiskLoading, setIsRiskLoading] = React.useState(false);
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

  // Set alignment based on URL parameters
  React.useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['risk', 'symptoms', 'firstaid'].includes(tab)) {
      setAlignment(tab);
    }
  }, [searchParams]);

  const handleChange = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
      // Update URL with the selected tab
      navigate(`/main?tab=${newAlignment}`);
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

  const handleRiskSubmit = async () => {
    if (!farmerType) {
      alert('Please select a farm type');
      return;
    }

    try {
      setIsRiskLoading(true);
      const res = await fetch('/api/profile/risk-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farm_type: farmerType }),
      });

      if (!res.ok) throw new Error('Failed to get risk summary');
      const data = await res.json();
      setRiskSummary(data.summary);
      setRiskSummaryOpen(true);
    } catch (error) {
      console.error('Risk summary error:', error);
      alert('Failed to generate risk summary. Please try again.');
    } finally {
      setIsRiskLoading(false);
    }
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

  React.useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [symptomHistory]);

  React.useEffect(() => {
    if (location.pathname === '/main') {
      const prevScrollRef = { current: 0 };

      const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollDirection = scrollTop < prevScrollRef.current ? 'up' : 'down';
        prevScrollRef.current = scrollTop;

        // Navigate back to / when user scrolls up to near the top
        if (scrollDirection === 'up' && scrollTop < 50) {
          navigate('/');
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname, navigate]);

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
    <div className="App">
      {location.pathname !== '/' && (
        <nav className="navbar">
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1>FarmerHealth</h1>
          </Link>
        </nav>
      )}

      {location.pathname === '/' && (
  <div style={{
    position: 'fixed',
    top: '32px',
    right: '40px',
    zIndex: 9999,
  }}>
    <button
      onClick={() => navigate('/resources')}
      style={{
        fontFamily: "'Afacad', sans-serif",
        backgroundColor: '#59775e',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        padding: '10px 20px',
        fontSize: '1rem',
        cursor: 'pointer',
      }}
    >
      Resources
    </button>
  </div>
)}

      <Routes>
        <Route path="/" element={<Launch />} />
        <Route path="/resources" element={<Resources />} />
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
            <ToggleButton
              value="firstaid"
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
              First Aid
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

                  <Button
                    variant="contained"
                    type="button"
                    sx={submitButtonSx}
                    onClick={handleRiskSubmit}
                    disabled={isRiskLoading}
                  >
                    {isRiskLoading ? 'Loading...' : 'Submit'}
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
                  <div className="symptom-chat-window" ref={chatWindowRef}>
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

          {alignment === 'firstaid' && (
            <FirstAid />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Dialog
        open={riskSummaryOpen}
        onClose={() => setRiskSummaryOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            fontFamily: "'Afacad', sans-serif",
            borderRadius: '12px',
            border: '2px solid #8f7c63',
          }
        }}
      >
        <DialogTitle sx={{
          color: '#59775e',
          fontWeight: 600,
          fontSize: '1.35rem',
          fontFamily: "'Afacad', sans-serif",
          borderBottom: '2px solid #8f7c63',
          pb: 2
        }}>
          Risk Summary
        </DialogTitle>
        <DialogContent sx={{ mt: 2, color: '#59775e', fontFamily: "'Afacad', sans-serif" }}>
          {isRiskLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress sx={{ color: '#59775e' }} />
            </Box>
          ) : (
            <Typography sx={{ whiteSpace: 'pre-wrap', color: '#59775e', fontFamily: "'Afacad', sans-serif", fontSize: '1.2rem', lineHeight: 1.6 }}>
              {riskSummary}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setRiskSummaryOpen(false)}
            variant="contained"
            sx={{
              fontFamily: "'Afacad', sans-serif",
              textTransform: 'none',
              backgroundColor: '#59775e',
              borderRadius: '8px',
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
