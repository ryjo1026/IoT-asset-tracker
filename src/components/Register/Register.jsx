import React from 'react';
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

    this.web3 = this.initWeb3();

    this.state = {
      loaded: null,
      submitDisabled: true,
      account: '',
      deviceName: '',
      days: '',
      hours: '',
      minPrice: '',
    };

    this.updateRegister = this.updateRegister.bind(this);

    // Also check status of contract
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

  checkAccountStatus() {
    // Check if MetaMask connected to network
    if (this.web3.currentProvider.publicConfigStore._state.networkVersion
      === 'loading') {
      this.setState({loaded: false, loadingError: 'networkConnection'});
      return;
    }
    // Check if accounts are available
    this.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.setState({loaded: false, loadingError: 'accountConnection'});
      } else {
        this.setState({loaded: true, account: accounts[0]});
      }
    });
  }

  getShortAccount() {
    return this.state.account.substr(0, 7) + '...';
  }

  getSubmitDisabled() {
    if (this.state.deviceName.length > 0 &&
      this.state.minPrice > 0 &&
      (this.state.hours > 0 || this.state.days > 0)) {
        return false;
      }
    return true;
  }

  // Plug stateless components into state
  updateRegister(key, value) {
    let newState = {};
    newState[key] = value;
    this.setState(newState);
  }

  // REACT FUNCTIONS ----------

  componentDidMount() {
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
              updateRegister={this.updateRegister}/>
            <div style={{textAlign: 'center'}}>
              <Button variant="raised" color="primary"
                disabled = {this.getSubmitDisabled()}
                style={{marginTop: '25px', textTransform: 'none'}}>
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
