import React from 'react';
import contract from 'truffle-contract';
import Web3 from 'web3';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Loading from '../Common/Loading.jsx';
import RegisterForm from './RegisterForm.jsx';
import TitleBar from '../Common/TitleBar.jsx';

// Handles state and gridding of all registration components
class Register extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      loaded: null,
      submitDisabled: true,
      account: '',
      deviceName: '',
      days: '',
      hours: '',
      minPrice: '',
    };

    this.web3 = this.initWeb3();
    this.AssetTracker = null;

    this.handleFormChange = this.handleFormChange.bind(this);
  }

  initContract() {
    let contractJson = require('../../AssetTracker.json');
    this.AssetTracker = contract(contractJson);
    this.AssetTracker.setProvider(this.web3.currentProvider);

    // Hard-code Address of contract on Ropsten
    this.address = '0xb42493870969a0e402ff5bca29a1dadd7366da8d';
  }

  initWeb3() {
    let web3 = window.web3;
    if (typeof web3 !== 'undefined') {
      // Check for injected web3 instance (MetaMask)
      web3 = new Web3(web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to Ropsten.
      web3 = new Web3(new web3.providers.HttpProvider('https://ropsten.infura.io'));
    }
    return web3;
  }

  // Two step process for checking if necessary resources in place
  checkAccountStatus() {
    // Check if MetaMask connected to network
    if (this.web3.currentProvider.publicConfigStore._state.networkVersion
      !== '3') {
      this.setState({loaded: false, loadingError: 'networkConnection'});
      return;
    }

    // Check if accounts are available
    this.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.setState({loaded: false, loadingError: 'accountConnection'});
      } else {
        // Init contract if not already initialized
        if (this.AssetTracker === null) {
          this.initContract();
        }
        this.setState({loaded: true, account: accounts[0]});
      }
    });
  }

  getShortAccount() {
    return this.state.account.substr(0, 7) + '...';
  }

  // Check if all fields are valid to be submitted
  getSubmitDisabled() {
    if (this.state.deviceName.length > 0 &&
      this.state.minPrice > 0 &&
      (this.state.hours > 0 || this.state.days > 0)) {
        return false;
      }
    return true;
  }

  // Handle changes to device options
  handleFormChange(key, value) {
    let newState = {};
    newState[key] = value;
    this.setState(newState);
  }

  // CONTRACT FUNCTIONS ----------

  registerDevice() {
    let usePeriod = (this.state.days*24*60*60)+(this.state.hours*60*60);
    this.AssetTracker.at(this.address).then((at) => {
      at.registerDevice(this.state.deviceName,
        usePeriod, // In seconds
        this.state.minPrice, // In ether
        'default', // TODO add option to frontend
        'null', // TODO add location
        {from: this.state.account},
      ).then(console.log);
    });
  }

  // REACT FUNCTIONS ----------

  componentDidMount() {
    // Always keep current account and status updated in state
    this.interval = setInterval(() => {
      this.checkAccountStatus();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // TODO clean up styling
  render() {
    if (this.state.loaded === null) {
      return null;
    }

    // If can't conenct to accounts, show loading
    if (!this.state.loaded) {
      return (
        <div className='register'>
          <Loading error={this.state.loadingError}/>
        </div>
      );
    }

    return (
      <div className='Register'>
        <TitleBar title='Register a Device' />
        <Grid container spacing={24}>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={5}>
            <RegisterForm
              deviceName = {this.state.deviceName}
              days = {this.state.days}
              hours = {this.state.hours}
              minPrice = {this.state.minPrice}
              onFormChange={this.handleFormChange}/>
            <div style={{textAlign: 'center'}}>
              <Button variant="raised" color="primary"
                disabled = {this.getSubmitDisabled()}
                style={{marginTop: '25px', textTransform: 'none'}}
                onClick={ () => this.registerDevice()}>
                Register device with account {this.getShortAccount()}
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={5} style={{textAlign: 'center'}}>
            <img alt='' src={require('./PlaceholderMap.png')} style = {{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
            }}/>
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
        </Grid>
      </div>
    );
  }
}

export default Register;
