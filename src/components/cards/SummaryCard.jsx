import React from 'react';
import PropTypes from 'prop-types';
import { Box, Card, CardContent, Typography } from '@mui/material';

const SummaryCard = ({ title, value, subtitle }) => (
  <Card variant="outlined" sx={{ height: '100%', minWidth: 0 }}>
    <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
      <Box sx={{ display: 'grid', gap: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ lineHeight: 1 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </CardContent>
  </Card>
);

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
};

SummaryCard.defaultProps = {
  subtitle: null,
};

export default SummaryCard;
