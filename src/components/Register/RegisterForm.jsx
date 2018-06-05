import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import NaturalNumberInput from './NaturalNumberInput.jsx';

// Stateless form implementation
class RegisterForm extends React.Component {
  constructor(props, context) {
    super(props);

    this.handleTimeChange = this.handleTimeChange.bind(this);
    this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
    this.handleDeviceNameChange = this.handleDeviceNameChange.bind(this);
  }

  handleTimeChange(key, value) {
    this.props.onFormChange(key, value);
  }

  handleMinPriceChange(e) {
    this.props.onFormChange('minPrice', e.target.value);
  }

  handleDeviceNameChange(e) {
    this.props.onFormChange('deviceName', e.target.value);
  }

  render() {
    return (
      <div className='RegisterForm'>
        <TextField
          disabled={this.props.disabled}
          id="full-width"
          placeholder="Device Name"
          value={this.props.deviceName}
          onChange={this.handleDeviceNameChange}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          margin="normal"
        />
      <div style={{display: 'inline'}}>
        <NaturalNumberInput label='days'
          disabled={this.props.disabled}
          value={this.props.days}
          updateRegisterForm={this.handleTimeChange}/>
        <NaturalNumberInput label='hours'
          disabled={this.props.disabled}
          value={this.props.hours}
          updateRegisterForm={this.handleTimeChange}
          syle={{float: 'right'}}/>
      </div>

        <TextField
          disabled={this.props.disabled}
          id="min-price"
          placeholder="Minimum price"
          value={this.props.minPrice}
          onChange={this.handleMinPriceChange}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            endAdornment:
              <InputAdornment position="end">ether</InputAdornment>,
          }}
          margin="normal"
        />
      </div>
    );
  }
}

export default RegisterForm;
