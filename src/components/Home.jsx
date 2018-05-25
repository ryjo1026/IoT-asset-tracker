import React from 'react';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

class Home extends React.Component {
  constructor(props, context) {
    super(props);
  }


  // TODO move related CSS to dedicated file
  render() {
    return (
      <div className='home'>
        <Typography variant="display3" color="primary" align="center">
          IoT Asset Tracker
        </Typography>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="body1" align="left">
              The IoT Asset Tracker provides a platform for matching IoT device
              owners with parties who are willing to pay for IoT data. Owners
              of IoT devices register their devices and how long they would like
              to lease their data. Bidders bid on the pool of currently
              availible registered devices. All transactions are enforced by
              the Ethereum Network via smart contracts.
            </Typography>
            <Typography variant="body1" align="left">
              This project is currently in development at: <a href="https://github.com/ryjo1026/IoTAssetTracker.git"> https://github.com/ryjo1026/IoTAssetTracker</a>.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2}></Grid>

          <Grid item xs={12} sm={2}></Grid>
          <Grid item xs={12} sm={4} style={{textAlign: 'center'}}>
            <Typography variant="title" color="inherit" align="center">
              Owners
            </Typography>
            <Button href="/register" variant="raised" color="primary"
              style={{marginTop: 25+'px', textTransform: 'none'}}>
              Register an IoT Device
            </Button>
            <div></div>
            <Button href="/update" variant="raised" color="primary"
              style={{marginTop: 25+'px', textTransform: 'none'}}>
              Update an Existing Device
            </Button>
          </Grid>
          <Grid className='left' item xs={12} sm={4}
            style={{textAlign: 'center'}}>
            <Typography variant="title" color="inherit" align="center">
              Bidders
            </Typography>
            <Button href="/search" variant="raised" color="primary"
              style={{marginTop: 50+'px', textTransform: 'none'}}>
              Search Availible Devices
            </Button>
          </Grid>
          <Grid item xs={12} sm={2}></Grid>
        </Grid>
      </div>
    );
  }
}

export default Home;
