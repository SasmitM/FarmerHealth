import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress sx={{ color: '#59775e' }} />
      </Box>
    );
  }

  const cardData = bundle && activeCategory ? bundle[activeCategory] : null;

  return (
    <Box
      sx={{
        padding: '32px 20px',
        backgroundColor: '#f7f3ee',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#8f7c63',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '16px',
          fontFamily: "'Afacad', sans-serif",
          textAlign: 'center',
        }}
      >
        First Aid Categories
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '28px',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {categories.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            variant="outlined"
            sx={{
              padding: '10px 24px',
              border: '2px solid #8f7c63',
              borderRadius: '999px',
              fontSize: '18px',
              fontFamily: "'Afacad', sans-serif",
              color: activeCategory === cat.id ? '#fff' : '#59775e',
              backgroundColor: activeCategory === cat.id ? '#ecaf9a' : '#f7f3ee',
              fontWeight: activeCategory === cat.id ? 600 : 400,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: activeCategory === cat.id ? '#ecaf9a' : '#f0ebe1',
                borderColor: '#59775e',
              },
            }}
          >
            {cat.name}
          </Button>
        ))}
      </Box>

      {activeCategory && (
        <Typography
          sx={{
            fontSize: '22px',
            fontWeight: 600,
            color: '#59775e',
            textAlign: 'center',
            marginBottom: '24px',
            fontFamily: "'Afacad', sans-serif",
            width: '100%',
          }}
        >
          {categories.find((c) => c.id === activeCategory)?.name}
        </Typography>
      )}

      {error && (
        <Typography
          sx={{
            color: '#cc0000',
            fontFamily: "'Afacad', sans-serif",
            textAlign: 'center',
            fontSize: '22px',
          }}
        >
          {error}
        </Typography>
      )}

      {cardData && (
        <Box sx={{ maxWidth: '760px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Card
            sx={{
              border: '2px solid #8f7c63',
              borderRadius: '16px',
              backgroundColor: '#fff',
              padding: '28px',
              width: '100%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            {cardData.title && (
              <Typography
                sx={{
                  fontSize: '26px',
                  fontWeight: 600,
                  color: '#59775e',
                  marginBottom: '20px',
                  fontFamily: "'Afacad', sans-serif",
                  textAlign: 'center',
                }}
              >
                {cardData.title}
              </Typography>
            )}

            {cardData.description && (
              <Typography
                sx={{
                  fontSize: '20px',
                  color: '#59775e',
                  lineHeight: 1.8,
                  fontFamily: "'Afacad', sans-serif",
                  marginBottom: '24px',
                  whiteSpace: 'pre-wrap',
                  textAlign: 'center',
                }}
              >
                {cardData.description}
              </Typography>
            )}

            {Array.isArray(cardData.steps) && cardData.steps.length > 0 && (
              <Box sx={{ marginBottom: '28px' }}>
                <Typography
                  sx={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#59775e',
                    marginBottom: '16px',
                    fontFamily: "'Afacad', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  Steps
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {cardData.steps.map((step, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <Box
                        sx={{
                          minWidth: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          backgroundColor: '#59775e',
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: '2px',
                          fontFamily: "'Afacad', sans-serif",
                        }}
                      >
                        {idx + 1}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '18px',
                          color: '#59775e',
                          lineHeight: 1.7,
                          fontFamily: "'Afacad', sans-serif",
                          textAlign: 'left',
                        }}
                      >
                        {getTextFromItem(step)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {Array.isArray(cardData.warnings) && cardData.warnings.length > 0 && (
              <Box sx={{ marginBottom: '28px' }}>
                <Typography
                  sx={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#59775e',
                    marginBottom: '16px',
                    fontFamily: "'Afacad', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  Warnings
                </Typography>
                <Box
                  sx={{
                    backgroundColor: '#fff9e6',
                    border: '2px solid #e6c96e',
                    borderRadius: '10px',
                    padding: '16px',
                  }}
                >
                  <ul style={{ color: '#59775e', margin: 0, paddingLeft: '20px' }}>
                    {cardData.warnings.map((warning, idx) => (
                      <li
                        key={idx}
                        style={{
                          marginBottom: '8px',
                          fontSize: '18px',
                          fontFamily: "'Afacad', sans-serif",
                          lineHeight: 1.6,
                        }}
                      >
                        {getTextFromItem(warning)}
                      </li>
                    ))}
                  </ul>
                </Box>
              </Box>
            )}

            {cardData.when_to_seek_help && (
              <Box
                sx={{
                  backgroundColor: '#ffcccc',
                  border: '2px solid #cc0000',
                  borderRadius: '10px',
                  padding: '20px',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#cc0000',
                    marginBottom: '12px',
                    fontFamily: "'Afacad', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  When to Seek Help
                </Typography>
                <Typography
                  sx={{
                    fontSize: '18px',
                    color: '#cc0000',
                    whiteSpace: 'pre-wrap',
                    fontFamily: "'Afacad', sans-serif",
                    lineHeight: 1.7,
                    textAlign: 'center',
                  }}
                >
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
