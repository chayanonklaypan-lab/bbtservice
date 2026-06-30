import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';

const TimelineList = ({ entries }) => (
  <Stack spacing={2}>
    {entries.map((item) => (
      <Card key={item.id} variant="outlined">
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle2">{item.editorName || 'ระบบ'}</Typography>
            <Typography variant="caption" color="text.secondary">
              {dayjs(item.createdAt?.toDate ? item.createdAt.toDate() : item.createdAt).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
            {item.message}
          </Typography>
        </CardContent>
      </Card>
    ))}
  </Stack>
);

export default TimelineList;
