import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import NaturalNumberInput from './NaturalNumberInput.jsx';

// Stateless form implementation
export default class RegisterForm extends React.Component {
  constructor(props, context) {
    super(props);

    this.handleDeviceChange = this.handleDeviceChange.bind(this);
    this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
  }

  handleDeviceChange(key, value) {
    let newDevice = this.props.device;
    newDevice[key] = value;
    this.props.onFormChange(newDevice);
  }

  handleMinPriceChange(e) {
    let newVal;
    if (e.target.value < 0) {
      // No negatives
      newVal = 0;
    } else {
      // Normal number handling
      newVal = e.target.value;
    }
    this.handleDeviceChange('minPrice', newVal);
  }

  render() {
    return (
      <div className='RegisterForm'>
        <TextField
          disabled={this.props.disabled}
          id="full-width"
          label="Device name"
          value={this.props.device.name}
          onChange={(e) => this.handleDeviceChange('name', e.target.value)}
          fullWidth
          margin="normal"/>
        <TextField
          disabled={this.props.disabled}
          id="full-width"
          label="Default code"
          value={this.props.device.defaultCode}
          onChange={(e) =>
            this.handleDeviceChange('defaultCode', e.target.value)}
          fullWidth
          margin="normal"/>

      <div style={{display: 'flex'}}>
        <NaturalNumberInput label='Days'
          disabled={this.props.disabled}
          value={this.props.device.days}
          onFormChange={this.handleDeviceChange}/>
        <div style={{marginLeft: '50px'}}></div>
        <NaturalNumberInput label='Hours'
          disabled={this.props.disabled}
          value={this.props.device.hours}
          onFormChange={this.handleDeviceChange}/>
      </div>
      <TextField
        disabled={this.props.disabled}
        id="min-price"
        label="Minimum price"
        value={this.props.device.minPrice}
        onChange={this.handleMinPriceChange}
        type="number"
        InputProps={{
          endAdornment:
            <InputAdornment position="end">ether</InputAdornment>,
        }}
        margin="normal"/>
        <TextField
          disabled={true}
          id="full-width"
          label="Location (change on map)"
          value={this.props.device.location}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}/>
      </div>
    );
  }
}
RegisterForm.propTypes = {
  device: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  onFormChange: PropTypes.func.isRequired,
};
