import React from 'react';
import Web3 from 'web3';

import Loading from './Loading.jsx';

class Register extends React.Component {
  constructor(props, context) {
    super(props);

    this.web3 = this.initWeb3();

    this.state = {
      loaded: false,
    };
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
    this.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.setState({loaded: false});
      } else {
        this.setState({loaded: true});
      }
    });
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

  render() {
    if (!this.state.loaded) {
      return (
        <div className='register'>
          <Loading/>
        </div>
      );
    }
    return (
      <div className='register'>
        <h1>Register</h1>
      </div>
    );
  }
}

export default Register;
