import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import TitleBar from '../Common/TitleBar.jsx';
import RegisterForm from './RegisterForm.jsx';
import RegisterTransactionInfo from './RegisterTransactionInfo.jsx';
import RegisterLocationPicker from './RegisterLocationPicker.jsx';
import './Register.css';

// Handles state and gridding of all registration components
export default class RegisterContainer extends React.Component {
  state = {
    submitDisabled: true,
    account: '',
    transaction: { // current/last transaction information
      pending: false, // true if currently waiting on transaction
      status: null, // status of the last transaction success or error
      message: '', // message associated with last transaction
    },
    device: { // device information
      name: '',
      defaultCode: '',
      days: '',
      hours: '',
      minPrice: '',
      location: '',
    },
  };

  static propTypes = {
    account: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
    contract: PropTypes.func.isRequired,
    contractAddress: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props);

    this.handleFormChange = this.handleFormChange.bind(this);
  }

  getShortAccount() {
    return this.props.account.substr(0, 7) + '...';
  }

  // Check if all fields are valid to be submitted
  getSubmitDisabled() {
    if (this.state.device.name.length > 0 &&
      this.state.device.minPrice > 0 &&
      (this.state.device.hours > 0 || this.state.device.days > 0)) {
        return false;
      }
    return true;
  }

  // Handle changes to device options
  handleFormChange(device) {
    this.setState({device: device});
  }

  // CONTRACT FUNCTIONS ----------

  registerDevice() {
    // Reset transaction state
    this.setState({transaction: {
      pending: true,
      status: null,
      message: '',
    }});

    // Convert use period into seconds
    let usePeriod = (this.state.device.days*24*60*60) + (this.state.device.hours*60*60);
    // Convert minPrice into wei
    let minPriceWei = this.state.device.minPrice * 1000000000000000000;

    // Connect to contract and register device via nested async functions
    this.props.contract.at(this.props.contractAddress).then((at) => {
      at.registerDevice(this.state.device.name,
        usePeriod, // In seconds
        minPriceWei, // In wei
        this.state.device.defaultCode,
        this.state.device.location, // Coordinates in string form
        {from: this.props.account},
      ).then( (response) => {
        // Successfull connection, set state with message and good status
        this.setState({transaction: {
          pending: false,
          status: 'success',
          message: response,
        }});
      }).catch( (error) => {
        // Error, set state with error message and error status
        this.setState({transaction: {
          pending: false,
          status: 'error',
          message: error,
        }});
      });
    });
  }

  // TODO clean up styling
  render() {
    // TODO abstract to stateless component and standardize to common
    let submit = null;
    if (this.state.transaction.pending) {
      submit =
      <div>
        <div className="spinner" style={{textAlign: 'center', margin: '50px'}}>
          <CircularProgress/>
        </div>
        <div style={{textAlign: 'center'}}>
          Adding transaction to the Ropsten blockchain
        </div>
      </div>;
    } else {
      submit = <Button variant="raised" color="primary"
        disabled = {this.getSubmitDisabled()}
        style={{marginTop: '25px', textTransform: 'none'}}
        onClick={() => this.registerDevice()}>
        Register device with account {this.getShortAccount()}
      </Button>;
    }

    return (
      <div className='Register'>
        <TitleBar title='Register a Device' />
        <Grid container spacing={24}>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={5}>
            <RegisterForm
              disabled = {this.state.transaction.pending}
              device = {this.state.device}
              onFormChange={this.handleFormChange}/>
            <div style={{textAlign: 'center'}}>
              {submit}
              <RegisterTransactionInfo
                transaction = {this.state.transaction}/>
            </div>
          </Grid>
          <Grid item xs={12} sm={5} style={{textAlign: 'center'}}>
            <RegisterLocationPicker
              device = {this.state.device}
              onLocationChange={this.handleFormChange}
            />
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
        </Grid>
      </div>
    );
  }
}
