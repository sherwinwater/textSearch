import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchText = () => {
  // Initialize state with data from localStorage
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('searchResults');
    try {
      return savedData ? JSON.parse(savedData) : [];
    } catch (e) {
      console.error('Error parsing stored search results:', e);
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('searchQuery') || "";
  });
  
  const [searchIndexId, setSearchIndexId] = useState(() => {
    return localStorage.getItem('searchIndexId') || "";
  });

  // Save to localStorage whenever search parameters change
  useEffect(() => {
    localStorage.setItem('searchQuery', searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem('searchIndexId', searchIndexId);
  }, [searchIndexId]);

  // Save search results to localStorage
  useEffect(() => {
    localStorage.setItem('searchResults', JSON.stringify(data));
  }, [data]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setData([]);

    try {
      const response = await axios.get(
        `http://localhost:5009/api/search_text/${encodeURIComponent(
          searchIndexId
        )}?query=${encodeURIComponent(searchQuery)}`
      );
      setData(response.data);
      // Save to localStorage immediately after successful response
      localStorage.setItem('searchResults', JSON.stringify(response.data));
    } catch (error) {
      setError(error.message);
      localStorage.setItem('searchError', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setData([]);
    setSearchQuery('');
    setSearchIndexId('');
    setError(null);
    // Clear all search-related localStorage items
    localStorage.removeItem('searchResults');
    localStorage.removeItem('searchQuery');
    localStorage.removeItem('searchIndexId');
    localStorage.removeItem('searchError');
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", margin: 2, padding: 2 }}>
      {/* Header and Clear Button */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h6">Search Text</Typography>
        {(data.length > 0 || searchQuery || searchIndexId) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearSearch}
            size="small"
          >
            Clear Search
          </Button>
        )}
      </Stack>

      {/* Search Section */}
      <Stack
        direction="row"
        spacing={2}
        sx={{ marginBottom: 3 }}
        alignItems="center"
      >
        <TextField
          fullWidth
          label="Enter your text index id"
          variant="outlined"
          value={searchIndexId}
          onChange={(e) => setSearchIndexId(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ maxWidth: 350 }}
        />
        <TextField
          fullWidth
          label="Enter your search query"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{ maxWidth: 1050 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={loading || !searchQuery.trim()}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </Stack>

      {/* Loading State */}
      {loading && (
        <Box sx={{ padding: 2, textAlign: "center" }}>Loading...</Box>
      )}

      {/* Error State */}
      {error && (
        <Box sx={{ padding: 2, color: "error.main" }}>Error: {error}</Box>
      )}

      {/* Results Table */}
      {!loading && !error && data.length > 0 && (
        <>
          <TableContainer sx={{ maxHeight: 900 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Score</TableCell>
                  <TableCell>Document ID</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Content</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item) => (
                  <TableRow
                    key={item.document_id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          borderRadius: 1,
                          padding: "4px 8px",
                          display: "inline-block",
                        }}
                      >
                        {typeof item.score === "number"
                          ? item.score.toFixed(2)
                          : item.score}
                      </Box>
                    </TableCell>
                    <TableCell>{item.document_id}</TableCell>
                    <TableCell>{item.position}</TableCell>
                    <TableCell sx={{ maxWidth: 1100 }}>
                      <Box className="whitespace-pre-wrap break-words max-w-md text-sm">
                        {item.content.slice(0, 2000)}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* No Results State */}
      {!loading && !error && data.length === 0 && searchQuery && (
        <Box sx={{ padding: 2, textAlign: "center", color: "text.secondary" }}>
          No results found for your search.
        </Box>
      )}
    </Paper>
  );
};

export default SearchText;