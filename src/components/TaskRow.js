import React from 'react';
import {TableRow, TableCell, Typography, Chip, Button, Box} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

const TaskRow = ({ item, index, handleView, handleSearch }) => {
    return (
        <TableRow key={item.task_id} hover>
            <TableCell>
                <Typography variant="body2" >
                    {index + 1}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" >
                    {item.task_id}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" >
                    <a
                        href={item.scraping_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: 'blue' }}
                    >
                        {item.scraping_url}
                    </a>
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2" >
                    {item.processed_files}
                </Typography>
            </TableCell>
            <TableCell>
                <Chip
                    label={item.status}
                    color={item.status === 'completed' ? 'success' : 'warning'}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                />
            </TableCell>
            <TableCell>
                {new Date(item.created_at).toLocaleString()}
            </TableCell>
            <TableCell align="right">
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleView(item.task_id)}
                    >
                        View
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<SearchIcon />}
                        onClick={() => handleSearch(item)}
                        disabled={item.status !== 'completed'}
                    >
                        Search
                    </Button>
                </Box>
            </TableCell>
        </TableRow>
    );
};

export default TaskRow;