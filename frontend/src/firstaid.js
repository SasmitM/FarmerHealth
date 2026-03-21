import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';

function FirstAid() {
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(null);
  const [categoryDetails, setCategoryDetails] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [detailsLoading, setDetailsLoading] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);

  // Fetch categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/firstaid/categories');
        if (!res.ok) throw new Error('Failed to fetch categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch category details when selected
  const handleCategoryClick = async (categoryId) => {
    setSelectedCategory(categoryId);
    setDetailsLoading(true);
    setOpenDialog(true);
    try {
      const res = await fetch(`/api/firstaid/${categoryId}`);
      if (!res.ok) throw new Error('Failed to fetch category details');
      const data = await res.json();
      setCategoryDetails(data);
    } catch (error) {
      console.error('Error fetching category details:', error);
      setCategoryDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCategoryDetails(null);
    setSelectedCategory(null);
  };

  const categoryEmojis = {
    'animal-bites': '🐕',
    'burns': '🔥',
    'chemical-splash': '⚠️',
    'cuts-wounds': '🩹',
    'heat-stroke': '☀️',
    'machinery-injury': '⚙️',
    'pesticide-exposure': '☠️',
    'respiratory-distress': '💨',
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress sx={{ color: '#59775e' }} />
      </Box>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#59775e', fontFamily: "'Afacad', sans-serif", marginBottom: '30px' }}>
        First Aid Guide
      </h2>

      <Grid container spacing={3}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category.id}>
            <Card
              onClick={() => handleCategoryClick(category.id)}
              sx={{
                backgroundColor: '#f7f3ee',
                border: '2px solid #8f7c63',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(89, 119, 94, 0.15)',
                  transform: 'translateY(-4px)',
                  borderColor: '#59775e',
                },
              }}
            >
              <CardActionArea>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography
                    sx={{
                      fontSize: '2.5rem',
                      marginBottom: '10px',
                    }}
                  >
                    {categoryEmojis[category.id] || '❓'}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '1.2rem',
                      fontFamily: "'Afacad', sans-serif",
                      color: '#59775e',
                      fontWeight: 600,
                    }}
                  >
                    {category.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            fontFamily: "'Afacad', sans-serif",
            borderRadius: '12px',
            border: '2px solid #8f7c63',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#59775e',
            fontWeight: 600,
            fontSize: '1.35rem',
            fontFamily: "'Afacad', sans-serif",
            borderBottom: '2px solid #8f7c63',
            pb: 2,
          }}
        >
          {selectedCategory && categories.find((c) => c.id === selectedCategory)?.name}
        </DialogTitle>
        <DialogContent sx={{ mt: 2, color: '#59775e', fontFamily: "'Afacad', sans-serif" }}>
          {detailsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress sx={{ color: '#59775e' }} />
            </Box>
          ) : categoryDetails ? (
            <Box>
              {categoryDetails.description && (
                <Typography sx={{ mb: 2, whiteSpace: 'pre-wrap', color: '#59775e' }}>
                  {categoryDetails.description}
                </Typography>
              )}

              {categoryDetails.steps && (
                <Box>
                  <Typography sx={{ fontWeight: 600, mb: 1, color: '#59775e' }}>Steps:</Typography>
                  <ol style={{ color: '#59775e' }}>
                    {categoryDetails.steps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>
                        {step}
                      </li>
                    ))}
                  </ol>
                </Box>
              )}

              {categoryDetails.warnings && (
                <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#ffe6cc', borderRadius: '8px' }}>
                  <Typography sx={{ fontWeight: 600, color: '#cc6600', mb: 1 }}>
                    ⚠️ Warnings:
                  </Typography>
                  <ul style={{ color: '#cc6600', margin: 0 }}>
                    {categoryDetails.warnings.map((warning, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>
                        {warning}
                      </li>
                    ))}
                  </ul>
                </Box>
              )}

              {categoryDetails.when_to_seek_help && (
                <Box sx={{ mt: 2, p: 1.5, backgroundColor: '#ffcccc', borderRadius: '8px' }}>
                  <Typography sx={{ fontWeight: 600, color: '#cc0000', mb: 1 }}>
                    🚨 When to Seek Help:
                  </Typography>
                  <Typography sx={{ color: '#cc0000', whiteSpace: 'pre-wrap' }}>
                    {categoryDetails.when_to_seek_help}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography sx={{ color: '#59775e' }}>
              Unable to load details. Please try again.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
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

export default FirstAid;