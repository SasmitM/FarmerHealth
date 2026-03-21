import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import './firstaid.css';

function FirstAid() {
  const [bundle, setBundle] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await fetch('/api/firstaid/bundle');
        if (!res.ok) throw new Error('Failed to load first aid data');
        const data = await res.json();
        const loadedBundle = data.bundle || {};
        setBundle(loadedBundle);

        const categoryList = Object.keys(loadedBundle).map((id) => ({
          id,
          name: loadedBundle[id]?.title || id.replace(/-/g, ' ').toUpperCase(),
        }));

        setCategories(categoryList);
        if (categoryList.length > 0) {
          setActiveCategory(categoryList[0].id);
        }
      } catch (err) {
        setError('Failed to load first aid data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, []);

  const getTextFromItem = (item) => {
    if (typeof item === 'string') return item;
    if (item && typeof item === 'object') {
      return item.detail || item.title || item.description || String(item);
    }
    return String(item);
  };

  if (loading) {
    return (
      <Box className="firstaid-loading">
        <CircularProgress className="firstaid-spinner" />
      </Box>
    );
  }

  const cardData = bundle && activeCategory ? bundle[activeCategory] : null;

  return (
    <Box className="firstaid-page">
      <Typography className="firstaid-eyebrow">
        First Aid Categories
      </Typography>

      <Box className="firstaid-chip-row">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            variant="outlined"
            className={`firstaid-chip ${activeCategory === cat.id ? 'firstaid-chip-active' : ''}`}
          >
            {cat.name}
          </Button>
        ))}
      </Box>

      {activeCategory && (
        <Typography className="firstaid-title">
          {categories.find((c) => c.id === activeCategory)?.name}
        </Typography>
      )}

      {error && (
        <Typography className="firstaid-error">
          {error}
        </Typography>
      )}

      {cardData && (
        <Box className="firstaid-card-wrap">
          <Card className="firstaid-card">
            {cardData.title && (
              <Typography className="firstaid-card-title">
                {cardData.title}
              </Typography>
            )}

            {cardData.description && (
              <Typography className="firstaid-description">
                {cardData.description}
              </Typography>
            )}

            {Array.isArray(cardData.steps) && cardData.steps.length > 0 && (
              <Box className="firstaid-section">
                <Typography className="firstaid-section-title">
                  Steps
                </Typography>
                <Box className="firstaid-steps-list">
                  {cardData.steps.map((step, idx) => (
                    <Box key={idx} className="firstaid-step-row">
                      <Box className="firstaid-step-badge">
                        {idx + 1}
                      </Box>
                      <Typography className="firstaid-step-text">
                        {getTextFromItem(step)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {Array.isArray(cardData.warnings) && cardData.warnings.length > 0 && (
              <Box className="firstaid-section">
                <Typography className="firstaid-section-title">
                  Warnings
                </Typography>
                <Box className="firstaid-warning-box">
                  <ul className="firstaid-warning-list">
                    {cardData.warnings.map((warning, idx) => (
                      <li key={idx} className="firstaid-warning-item">
                        {getTextFromItem(warning)}
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            )}

            {cardData.when_to_seek_help && (
              <Box className="firstaid-help-box">
                <Typography className="firstaid-help-title">
                  When to Seek Help
                </Typography>
                <Typography className="firstaid-help-text">
                  {cardData.when_to_seek_help}
                </Typography>
              </Box>
            )}
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default FirstAid;
