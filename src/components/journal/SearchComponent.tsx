import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RatingStars from '../utilities/RatingStars';
import { ConcertEvent } from '../../types/events';

interface SearchComponentProps {
  data: ConcertEvent[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ConcertEvent[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    // Log for debugging
    console.log("Search button clicked");
    console.log("Search term:", searchTerm);
    console.log("Available data:", data);
    
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    const term = searchTerm.toLowerCase();
    
    // Handle case where data might be undefined or empty
    if (!data || data.length === 0) {
      console.log("No data available for search");
      setSearchResults([]);
      setHasSearched(true);
      return;
    }
    
    try {
      const results = data.filter(event => {
        // Add null checks to prevent errors
        const bandName = event.bandName?.toLowerCase() || '';
        const place = event.place?.toLowerCase() || '';
        const comment = event.comment?.toLowerCase() || '';
        
        return bandName.includes(term) ||
               place.includes(term) ||
               comment.includes(term);
      });
      
      console.log("Search results:", results);
      setSearchResults(results);
      setHasSearched(true);
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]);
      setHasSearched(true);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log("Enter key pressed");
      handleSearch();
    }
  };

  const formatDate = (date: string | number[]) => {
    try {
      if (Array.isArray(date)) {
        const [year, month, day] = date;
        return new Date(year, month - 1, day).toLocaleDateString();
      } else if (typeof date === 'string' && date.startsWith('[') && date.endsWith(']')) {
        try {
          const dateArray = JSON.parse(date);
          if (Array.isArray(dateArray) && dateArray.length === 3) {
            return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]).toLocaleDateString();
          }
        } catch (error) {
          return 'Invalid date format';
        }
      } else if (date) {
        return new Date(date).toLocaleDateString();
      } else {
        return 'No date';
      }
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for bands, locations, comments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton onClick={handleClear} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{
            ml: 1,
            px: 3,
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'primary.dark',
              transform: 'scale(1.05)',
              transition: 'all 0.2s'
            }
          }}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Box>

      {hasSearched && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {searchResults.length === 0 
              ? 'No results found' 
              : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''}`}
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {searchResults.map((result) => (
              <Box key={result.id} sx={{ width: { xs: '100%', sm: '45%', md: '30%' } }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      {result.bandName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {result.place}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(result.date)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {result.comment}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <RatingStars rating={result.rating} />
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SearchComponent;