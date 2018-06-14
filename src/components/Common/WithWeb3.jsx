import React from 'react';
import contract from 'truffle-contract';
import Web3 from 'web3';

import Loading from './Loading.jsx';

const contractAddress = '0xf02989fe46646f6c45d22d08d5384ae6c515673d';


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
    state = {hasError: null, contract: null};

    getContract() {
      let contractJson = require('../../AssetTracker.json');
      let AssetTracker = contract(contractJson);
      AssetTracker.setProvider(web3.currentProvider);
      AssetTracker.defaults({
        gasPrice: 10000000,
        gas: 4700000,
      });

      this.setState({contract: AssetTracker});
    }

    checkConnectionStatus() {
      // Check MetaMask installed and connected to the network
      if (web3 === undefined
        || web3.currentProvider.publicConfigStore._state.networkVersion !== '3') {
        this.setState({hasError: true, error: new NetworkConnectionError(), contract: null});
        return;
      }
      // Check account connection
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length === 0) {
          this.setState({hasError: true, error: new AccountConnectionError(), contract: null});
        } else {
          // If no existing contract, initialize
          if (this.state.contract === null) {
            this.getContract();
          }
          this.setState({hasError: false, error: null});
        }
      });
    }

    componentDidMount() {
      // Continuously check load status
      this.interval = setInterval(() => {
        this.checkConnectionStatus();
      }, 1000);
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

      return <Component web3={web3}
        contract={this.state.contract}
        contractAddress={contractAddress}/>;
    }
  }

  return WithWeb3Component;
}
