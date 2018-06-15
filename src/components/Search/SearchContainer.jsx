import React from 'react';
import contract from 'truffle-contract';
import Web3 from 'web3';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Loading from '../Common/Loading.jsx';
import TitleBar from '../Common/TitleBar.jsx';

import SearchTable from './SearchTable.jsx';
import SearchDeviceInfo from './SearchDeviceInfo.jsx';

// State manager for Search page
export default class SearchContainer extends React.Component {
  constructor(props, context) {
    super(props);
    this.web3 = this.initWeb3();
    this.AssetTracker = null;

    this.web3 = this.initWeb3();
    this.AssetTracker = null;

    this.state = {
      account: '',
      loaded: null,
      selected: null,
      data: [],
      bidAmount: 0,
      submitDisabled: false,
      bidDisabled: false,
    };

    // SearchTable Handlers
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.checkIsSelected = this.checkIsSelected.bind(this);

    // DeviceInfo handlers
    this.handleBidAmountChange = this.handleBidAmountChange.bind(this);
  }

  // TODO remove this code duplication (possibly with HOC)
  initWeb3() {
    let web3 = window.web3;
    if (typeof web3 !== 'undefined') {
      // Check for injected web3 instance (MetaMask)
      web3 = new Web3(web3.currentProvider);
    }
    return web3;
  }

  initContract() {
    let contractJson = require('../../build/contracts/AssetTracker.json');
    this.AssetTracker = contract(contractJson);
    this.AssetTracker.setProvider(this.web3.currentProvider);
    this.AssetTracker.defaults({
      gasPrice: 10000000,
      gas: 4700000,
    });

    // Hard-code Address of contract on Ropsten
    this.address = '0xf02989fe46646f6c45d22d08d5384ae6c515673d';
    if (this.web3.currentProvider.publicConfigStore._state.networkVersion === '1515') {
      this.address = '0x8b78cd6b7aae0b56e924d261497cccfb066433a3';
    }
  }

  // Three step process for checking if necessary resources in place
  checkAccountStatus() {
    // Check MetaMask installed
    if (this.web3 === undefined) {
      this.setState({loaded: false, loadingError: 'networkConnection'});
      return;
    }

    // Check if MetaMask connected to network
    if (this.web3.currentProvider.publicConfigStore._state.networkVersion !== '3') {
      this.setState({loaded: false, loadingError: 'networkConnection'});
      return;
    }

    // Check if accounts are available
    this.web3.eth.getAccounts().then((accounts) => {
      if (accounts.length === 0) {
        this.setState({loaded: false, loadingError: 'accountConnection'});
      } else {
        // Init contract if not already initialized TODO better way??
        if (this.AssetTracker === null) {
          this.initContract();
          this.getAllDeviceData();
        }
        this.setState({loaded: true, account: accounts[0]});
      }
    });
  }

  getShortAccount() {
    return this.state.account.substr(0, 7) + '...';
  }

  // OPTIMIZE
  getDeviceByID(id) {
    let dataLength = this.state.data.length;
    for (let i = 0; i < dataLength; i++) {
        if (this.state.data[i].id === id) {
          return this.state.data[i];
        }
    }
    return null;
  }

  getSelectedDevice() {
    if (this.state.selected === null) {
      return null;
    } else {
      return this.getDeviceByID(this.state.selected);
    }
  }

  checkIsSelected(id) {
    return (id === this.state.selected);
  }

  handleRequestSort(order, orderBy) {
    let data = order === 'desc'
        ? this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));

    this.setState({data});
  }

  handleRowClick(event, id) {
    let device = this.getDeviceByID(id);
    if (id === this.state.selected) {
      this.setState({
        selected: null,
      });
      return;
    }
    if (device.status) {
      this.setState({
        selected: id,
        bidAmount: device.minPrice,
        submitDisabled: false,
        bidDisabled: false,
      });
    } else {
      this.setState({
        selected: id,
        bidAmount: device.minPrice,
        submitDisabled: true,
        bidDisabled: true,
      });
    }
  }

  handleBidAmountChange(event, device) {
    if (event.target.value >= device.minPrice &&
    device.status) {
      this.setState({
        bidAmount: event.target.value,
        submitDisabled: false,
      });
    } else {
      this.setState({
        bidAmount: event.target.value,
        submitDisabled: true,
      });
    }
  }

  // Takes the array returned from the solidity function an turns it into an object
  getDataFromDevice(device, id) {
    // Conver minPrice out of Wei
    let minPriceEther = device[3] / 1000000000000000000;
    return {
      id: id,
      name: device[0],
      useLength: device[1].toString(),
      location: device[2],
      minPrice: minPriceEther.toString(),
      highestBid: device[4].toString(),
      status: device[5],
    };
  }

  // CONTRACT FUNCTIONS ----------

  // TODO only get rendered data (make ghost elts for rest of data?)
  getAllDeviceData() {
    this.AssetTracker.at(this.address).then((at) => {
      at.numDevices().then((numDevices) => {
        // Predeclare size for preformance gains?
        let data = [];
        for (let i = 0; i < numDevices; ++i) {
          at.getDeviceInfo(i).then((device) => data.push(this.getDataFromDevice(device, i)));
        }
        this.setState({
          data: data,
        });
      });
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
    // TODO cancel asyncs to prevent mem leak
  }

  render() {
    if (this.state.loaded === null) {
      return null;
    }

    if (!this.state.loaded) {
      return (
        <div className='register'>
          <Loading error={this.state.loadingError}/>
        </div>
      );
    }

    return (
      <div className='Search'>
        <TitleBar title='Search for Availible Devices'/>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs sm>
            <Paper style={{width: '100%'}}>
              <SearchTable
                data={this.state.data}
                onRowClick={this.handleRowClick}
                onRequestSort={this.handleRequestSort}
                checkIsSelected={this.checkIsSelected}/>
            </Paper>
          </Grid>
          {(this.getSelectedDevice() !== null) && <Grid item xs sm style={{
              display: 'flex',
              alignItems: 'center'}}>
            <SearchDeviceInfo
              deviceData = {this.getSelectedDevice()}
              shortAccount = {this.getShortAccount()}
              onBidAmountChange = {this.handleBidAmountChange}
              submitDisabled = {this.state.submitDisabled}
              bidDisabled = {this.state.bidDisabled}
              bidAmount = {this.state.bidAmount}
            />
          </Grid>}
          <Grid item xs={12} sm={1}></Grid>
        </Grid>
      </div>
    );
  }
}
