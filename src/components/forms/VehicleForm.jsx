import React from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, TextField } from '@mui/material';

const VehicleForm = ({ values, onChange, onSubmit, loading }) => (
  <form onSubmit={onSubmit} noValidate>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ทะเบียนรถ"
          name="licensePlate"
          value={values.licensePlate}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ชื่อรถ"
          name="name"
          value={values.name}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ประเภทรถ"
          name="type"
          value={values.type}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="ชื่อคนขับ"
          name="driverName"
          value={values.driverName}
          onChange={onChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="สถานะ"
          name="status"
          value={values.status}
          onChange={onChange}
          required
        />
      </Grid>
      <Grid item xs={12} sx={{ textAlign: 'right' }}>
        <Button type="submit" variant="contained" disabled={loading}>
          บันทึกรถ
        </Button>
      </Grid>
    </Grid>
  </form>
);

VehicleForm.propTypes = {
  values: PropTypes.shape({
    licensePlate: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    driverName: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

VehicleForm.defaultProps = {
  loading: false,
};

export default VehicleForm;
