import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

export default class SearchDeviceInfo extends React.Component {
  constructor(props, context) {
    super(props);

    this.handleBidAmountChange = this.handleBidAmountChange.bind(this);
  }

  handleBidAmountChange(event, device) {
    this.props.onBidAmountChange(event, device);
  }

  render() {
    let device = this.props.deviceData;

    if (device === null) {
      return null;
    }

    return (
      <div className='SearchDeviceInfo' style={{width: '100%'}}>
        <Card>
          <CardContent style={{marginLeft: '25px', marginTop: '25px'}}>
            <Typography variant="title" align="left">
              {device.deviceName}
            </Typography>
            <Typography variant="subheading" color="textSecondary" align="left">
              Minimum Bid Price: {device.minPrice} ether
            </Typography>
            <TextField
                id="ticket-amount"
                label="Bid"
                disabled={this.props.bidDisabled}
                value={this.props.bidAmount}
                onChange={(event) => this.handleBidAmountChange(event, device)}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps= {{
                  endAdornment:
                    <InputAdornment position="end">ether</InputAdornment>,
                }}
                margin="normal"
            />
          </CardContent>
          <CardActions style={{marginLeft: '25px', marginBottom: '25px'}}>
            <Button variant="raised" color="primary"
              disabled = {this.props.submitDisabled}
              style={{marginTop: '25px', textTransform: 'none'}}>
              Bid {this.props.bidAmount} ether
              with account {this.props.shortAccount}
            </Button>
          </CardActions>
        </Card>
      </div>);
  }
}
SearchDeviceInfo.propTypes = {
  submitDisabled: PropTypes.bool.isRequired,
  bidDisabled: PropTypes.bool.isRequired,
  shortAccount: PropTypes.string.isRequired,
  bidAmount: PropTypes.string.isRequired,
  deviceData: PropTypes.object.isRequired,
  onBidAmountChange: PropTypes.func.isRequired,
};
