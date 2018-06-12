import React from 'react';
import {Link} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import './Home.css';

function Home() {
  // TODO turn into an actual Landing Page
  return (
    <div className='home'>
      <Typography variant="display3" color="primary" align="center">
        IoT Asset Tracker
      </Typography>
      <Grid container spacing={40}>
        <Grid item xs={12} sm={12}></Grid>

        <Grid item xs={12} sm={2}></Grid>
        <Grid item xs={12} sm={4} style={{textAlign: 'center'}}>
          <Typography variant="title" color="inherit" align="center">
            Own an IoT Device?
          </Typography>
          <Typography variant="body1" align="left" className="description">
            Provide some information about your device and how long you would like to lease its
            data for. Interested parties will bid on your device and your Ethereum account will be
            credited with the price of the sale.
          </Typography>
          <Button component={Link} to="/register"
            variant="raised" color="primary"
            style={{textTransform: 'none', marginTop: '25px'}}>
              Register an IoT Device
          </Button>
        </Grid>
        <Grid className='left' item xs={12} sm={4}
          style={{textAlign: 'center'}}>
          <Typography variant="title" color="inherit" align="center">
            Want data from IoT Devices?
          </Typography>
          <Typography variant="body1" align="left" className="description">
            Search across all registered IoT devices and bid on access to them. Once a bid has
            been won, your ethereum account will be automatically charged and you will be given
            an access code which will allow you to retrieve data from the device.
          </Typography>
          <Button component={Link} to="/search"
            variant="raised" color="primary"
            style={{textTransform: 'none', marginTop: '25px'}}>
            Search Availible Devices
          </Button>
        </Grid>
        <Grid item xs={12} sm={2}></Grid>
      </Grid>
    </div>
  );
}

export default Home;
