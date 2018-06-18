import React from 'react';
import contract from 'truffle-contract';
import Web3 from 'web3';

import Loading from './Loading.jsx';

// ROPSTEN ADDRESS
let contractAddress = '0xf02989fe46646f6c45d22d08d5384ae6c515673d';

class NetworkConnectionError extends Error {
  constructor(message = 'Cannot connect to MetaMask.') {
    super(message);
    this.name = 'NetworkConnectionError';
  }
}
class AccountConnectionError extends Error {
  constructor(message = 'Cannot connect to Accounts.') {
    super(message);
    this.name = 'AccountConnectionError';
  }
}

export default function withWeb3(Component) {
  let web3 = window.web3;
  if (typeof web3 !== 'undefined') {
    // Get injected web3 instance (MetaMask)
    web3 = new Web3(web3.currentProvider);
  }

  class WithWeb3Component extends React.Component {
    state = {
      account: '',
      hasError: null,
      contract: null,
    };

    getContract() {
      let contractJson = require('../../build/contracts/AssetTracker.json');
      let AssetTracker = contract(contractJson);
      AssetTracker.setProvider(web3.currentProvider);
      AssetTracker.defaults({
        gasPrice: 10000000,
        gas: 4700000,
      });

      this.setState({contract: AssetTracker});
    }

    checkConnectionStatus() {
      let network = web3.currentProvider.publicConfigStore._state.networkVersion;
      if (network === '1515') {
        contractAddress = '0x533e7693b92e0c77cd6c148dcbcc92f47ebbf980';
      } else {
        contractAddress = '0xf02989fe46646f6c45d22d08d5384ae6c515673d';
      }

      // Check MetaMask installed and connected to either Ropsten or LTHNet
      if (web3 === undefined || !(network === '3' || network === '1515')) {
        this.setState({hasError: true,
          error: new NetworkConnectionError(),
          account: null,
          contract: null});
        return;
      }
      // Check account connection
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length === 0) {
          this.setState({hasError: true,
            error: new AccountConnectionError(),
            account: null,
            contract: null});
        } else {
          // If no existing contract, initialize
          if (this.state.contract === null) {
            this.getContract();
          }
          this.setState({hasError: false, error: null, account: accounts[0]});
        }
      });
    }

    componentDidMount() {
      // Continuously check load status
      this.interval = setInterval(() => {
        this.checkConnectionStatus();
      }, 1000);
    }

    // Properly destruct interval
    componentWillUnmount() {
      clearInterval(this.interval);
    }

    render() {
      // Prevents flashing page on screen
      if (this.state.hasError === null) {
        return null;
      } else if (this.state.hasError) {
        return <Loading error={this.state.error}/>;
      }

      if (this.state.contract === null) {
        return <Loading error={this.state.error}/>;
      }

      return <Component account={this.state.account}
        web3={web3}
        contract={this.state.contract}
        contractAddress={contractAddress}/>;
    }
  }

  return WithWeb3Component;
}
