import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

import NaturalNumberInput from './NaturalNumberInput.jsx';

// Stateless form implementation
class RegisterForm extends React.Component {
  constructor(props, context) {
    super(props);

    this.updateForm = this.updateForm.bind(this);
    this.handleMinPriceChange = this.handleMinPriceChange.bind(this);
    this.handleDeviceNameChange = this.handleDeviceNameChange.bind(this);
  }

  updateForm(key, value) {
    this.props.updateRegister(key, value);
  }

  handleMinPriceChange(e) {
    this.props.updateRegister('minPrice', e.target.value);
  }

  handleDeviceNameChange(e) {
    this.props.updateRegister('deviceName', e.target.value);
  }

  render() {
    return (
      <div className='RegisterForm'>
        <TextField
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
          value={this.props.days}
          updateRegisterForm={this.updateForm}/>
        <NaturalNumberInput label='hours'
          value={this.props.hours}
          updateRegisterForm={this.updateForm}
          syle={{float: 'right'}}/>
      </div>

        <TextField
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
