import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';
import Typography from '@material-ui/core/Typography';


export default function ManageDeviceInfo({device, onEndClicked, onStartClicked, onRefreshClicked}) {
  let deviceStatus= null;
  let auctionToggle= null;
  if (device.status) {
    deviceStatus = <Typography variant="subheading" style={{color: '#2ecc71'}}>
      Bidding currently open
    </Typography>;
    auctionToggle = <Button variant="raised"
      color="primary"
      style={{textTransform: 'none'}}
      onClick={onEndClicked}>
        End Auction
    </Button>;
  } else {
    deviceStatus = <Typography variant="subheading" style={{color: '#e74c3c'}}>
      Bidding closed
    </Typography>;
    auctionToggle = <Button variant="raised"
      color="primary"
      style={{textTransform: 'none'}}
      onClick={onStartClicked}>
        Start Auction
    </Button>;
  }

  return (
    <div className='ManageDeviceInfo'>
      <Card style={{marginTop: '50px'}}>
        <CardHeader
            action={
              <IconButton onClick={onRefreshClicked}>
                <Refresh />
              </IconButton>
            }
            title={device.name}
            subheader={deviceStatus}
          />
        <CardContent>
          <div style={{display: 'flex'}}>
            <Typography variant="subheading" color="inherit">
              Minimum price:&nbsp;
            </Typography>
            <Typography variant="subheading" color="textSecondary">
              {device.minPrice}
            </Typography>
          </div>
          <div style={{display: 'flex'}}>
            <Typography variant="subheading" color="inherit">
              Current bid price:&nbsp;
            </Typography>
            <Typography variant="subheading" color="textSecondary">
              {device.highestBid}
            </Typography>
          </div>
        </CardContent>
        <CardActions style={{marginBottom: '25px'}}>
          {auctionToggle}
        </CardActions>
      </Card>
    </div>);
}
ManageDeviceInfo.propTypes = {
  device: PropTypes.object.isRequired,
  onStartClicked: PropTypes.func.isRequired,
  onEndClicked: PropTypes.func.isRequired,
  onRefreshClicked: PropTypes.func.isRequired,
};
