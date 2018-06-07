import React from 'react';
import contract from 'truffle-contract';
import Web3 from 'web3';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import Loading from '../Common/Loading.jsx';
import TitleBar from '../Common/TitleBar.jsx';
import RegisterForm from './RegisterForm.jsx';
import RegisterTransactionInfo from './RegisterTransactionInfo.jsx';
import RegisterLocationPicker from './RegisterLocationPicker.jsx';
import './Register.css';

// Handles state and gridding of all registration components
class Register extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      loaded: null,
      submitDisabled: true,
      account: '',
      transaction: { // current/last transaction information
        pending: false, // true if currently waiting on transaction
        status: null, // status of the last transaction success or error
        message: '', // message associated with last transaction
      },
      device: {
        name: '',
        defaultCode: '',
        days: '',
        hours: '',
        minPrice: '',
        location: '',
      },
    };
    // TODO organize state with nested dictionaries

    this.web3 = this.initWeb3();
    this.AssetTracker = null;

    this.handleFormChange = this.handleFormChange.bind(this);
  }

  initContract() {
    let contractJson = require('../../AssetTracker.json');
    this.AssetTracker = contract(contractJson);
    this.AssetTracker.setProvider(this.web3.currentProvider);
    this.AssetTracker.defaults({
      gasPrice: 10000000,
      gas: 4700000,
    });

    // Hard-code Address of contract on Ropsten
    this.address = '0xb42493870969a0e402ff5bca29a1dadd7366da8d';
  }

  initWeb3() {
    let web3 = window.web3;
    if (typeof web3 !== 'undefined') {
      // Check for injected web3 instance (MetaMask)
      web3 = new Web3(web3.currentProvider);
    }
    return web3;
  }

  // Three step process for checking if necessary resources in place
  checkAccountStatus() {
    // Check MetaMask installed
    if (this.web3 === undefined) {
      this.setState({loaded: false, loadingError: 'networkConnection'});
      return;
    }

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
    let usePeriod = (this.state.device.days*24*60*60)+
      (this.state.device.hours*60*60);

    // Connect to contract and register device via nested async functions
    this.AssetTracker.at(this.address).then((at) => {
      at.registerDevice(this.state.device.name,
        usePeriod, // In seconds
        this.state.device.minPrice, // In ether
        'default', // TODO add passcode option to frontend
        'null', // TODO add location
        {from: this.state.account},
      ).then( (response) => {
        // Successfull connection, set state with message and good status
        console.log(response);
        this.setState({transaction: {
          pending: false,
          status: 'success',
          message: response,
        }});
      }).catch( (error) => {
        // Error, set state with error message and error status
        console.log(error);
        this.setState({transaction: {
          pending: false,
          status: 'error',
          message: error,
        }});
      });
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

    // TODO abstract to stateless component
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
            <RegisterLocationPicker/>
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
        </Grid>
      </div>
    );
  }
}

export default Register;
