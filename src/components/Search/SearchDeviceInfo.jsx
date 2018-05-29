import React from 'react';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

class SearchDeviceInfo extends React.Component {
  getSubmitDisabled() {
    return false;
  }

  getShortAccount() {
    return '0x0000';
  }

  render() {
    let device = this.props.deviceData;

    if (device === null) {
      return null;
    }

    return (
      <div className='SearchDeviceInfo' style={{
        marginLeft: '50px',
        marginBottom: '56px',
        width: '100%'}}>
        <Card>
          <CardContent>
            <Typography variant="title" align="left">
              {device.deviceName}
            </Typography>
            <Typography variant="subheading" color="textSecondary" align="left">
              Minimum Bid Price: {device.minPrice} ether
            </Typography>
          </CardContent>
          <CardActions>
            <Button variant="raised" color="primary"
              disabled = {this.getSubmitDisabled()}
              style={{marginTop: '25px', textTransform: 'none'}}>
              Bid 0.1 ether with account {this.getShortAccount()}
            </Button>
          </CardActions>
        </Card>
      </div>);
  }
}

export default SearchDeviceInfo;
