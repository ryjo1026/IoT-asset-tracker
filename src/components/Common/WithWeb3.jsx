import React from 'react';
import Web3 from 'web3';

import Loading from './Loading.jsx';

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
    state = {hasError: null};

    checkConnectionStatus(web3) {
      // Check MetaMask installed and connected to the network
      if (web3 === undefined
        || web3.currentProvider.publicConfigStore._state.networkVersion !== '3') {
        this.setState({hasError: true, error: new NetworkConnectionError()});
        return;
      }

      // Check account connection
      web3.eth.getAccounts().then((accounts) => {
        if (accounts.length === 0) {
          this.setState({hasError: true, error: new AccountConnectionError()});
        } else {
          this.setState({hasError: false, error: null});
        }
      });
    }

    componentDidMount() {
      this.interval = setInterval(() => {
        this.checkConnectionStatus(web3);
      }, 1000);
    }

    render() {
      // Prevents flashing page on screen
      if (this.state.hasError === null) {
        return null;
      } else if (this.state.hasError) {
        return <Loading error={this.state.error}/>;
      }

      return <Component web3={web3}/>;
    }
  }

  return WithWeb3Component;
}
