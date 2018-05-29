import React from 'react';
import Web3 from 'web3';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Loading from '../Common/Loading.jsx';
import TitleBar from '../Common/TitleBar.jsx';

import SearchTable from './SearchTable.jsx';

class Search extends React.Component {
  constructor(props, context) {
    super(props);

    this.web3 = this.initWeb3();
    this.state = {
      loaded: null,
    };

    this.id = 0;
    this.data = [
      this.createData('StudiecentrumTemperature', '0.001', true),
      this.createData('DBuildingHumidity', '0.01', true),
      this.createData('MBuildingPressure', '0.01', false),
      this.createData('StudiecentrumPressure', '0.005', true),
      this.createData('DBuildingFridge', '0.1', false),
    ];

    this.checkAccountStatus();
  }

  // TODO remove this code duplication
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
        this.setState({loaded: true, account: accounts[0]});
      }
    });
  }

  // Function for creating Mock Data TODO remove
  createData(deviceName, minPrice, status) {
    this.id++;
    let id = this.id;
    return {id, deviceName, minPrice, status};
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
    if (this.state.loaded === null) {
      return null;
    }

    // If can't conenct to accounts, show loading TODO fix flashing on screen
    if (!this.state.loaded) {
      return (
        <div className='register'>
          <Loading/>
        </div>
      );
    }


    return (
      <div className='Search'>
        <TitleBar title='Search for Availible Devices'/>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={5}>
            <Paper><SearchTable data={this.data}/></Paper>
          </Grid>
          <Grid item xs={12} sm={5}></Grid>
          <Grid item xs={12} sm={1}></Grid>
        </Grid>
      </div>
    );
  }
}

export default Search;
