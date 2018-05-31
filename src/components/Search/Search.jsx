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
class Search extends React.Component {
  constructor(props, context) {
    super(props);
    this.id = 0;

    this.state = {
      account: '',
      loaded: null,
      selected: null,
      order: 'asc',
      orderBy: 'deviceName',
      data: [
        this.createData('StudiecentrumTemperature', '0.001', true),
        this.createData('DBuildingHumidity', '0.01', true),
        this.createData('MBuildingPressure', '0.01', false),
        this.createData('StudiecentrumPressure', '0.005', true),
        this.createData('DBuildingFridge', '0.1', false),
        this.createData('DBuildingMicrowave', '0.01', true),
      ].sort((a, b) => (a.deviceName < b.deviceName ? -1 : 1)),
      page: 0,
      rowsPerPage: 10,

      bidAmount: 0,
      submitDisabled: false,
      bidDisabled: false,
    };

    this.columnData = [
      {id: 'deviceName',
        numeric: false, disablePadding: false, label: 'Device Name'},
      {id: 'minPrice',
        numeric: true, disablePadding: false, label: 'Minimum Bid (ether)'},
      {id: 'status',
        numeric: false, disablePadding: false, label: 'Status'},
    ];

    this.web3 = this.initWeb3();
    this.AssetTracker = null;

    // Table handlers
    this.handleRequestSort = this.handleRequestSort.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.isSelected = this.isSelected.bind(this);

    // DeviceInfo handlers
    this.handleBidAmountChange = this.handleBidAmountChange.bind(this);
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

  initContract() {
    let contractJson = require('../../AssetTracker.json');
    this.AssetTracker = contract(contractJson);
    this.AssetTracker.setProvider(this.web3.currentProvider);

    // Hard-code Address of contract on Ropsten
    this.address = '0xb42493870969a0e402ff5bca29a1dadd7366da8d';
  }

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

  // Function for creating Mock Data TODO remove
  createData(deviceName, minPrice, status) {
    this.id++;
    let id = this.id;
    return {id, deviceName, minPrice, status};
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

  isSelected(id) {
    return (id === this.state.selected);
  }

  handleRequestSort(event, property) {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    let data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({data, order, orderBy});
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

  handleChangeRowsPerPage(event) {
    this.setState({rowsPerPage: event.target.value});
  }

  handleChangePage(event, page) {
    this.setState({page});
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

    if (!this.state.loaded) {
      return (
        <div className='register'>
          <Loading error={this.state.loadingError}/>
        </div>
      );
    }

    // If no selected device do not render DeviceInfo
    if (this.getSelectedDevice() === null) {
      return (
        <div className='Search'>
          <TitleBar title='Search for Availible Devices'/>
          <Grid container spacing={24}>
            <Grid item xs={12} sm={1}></Grid>
            <Grid item xs={12} sm={10}>
              <Paper style={{width: '100%'}}>
                <SearchTable
                  columnData={this.columnData}
                  data={this.state.data}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRowClick={this.handleRowClick}
                  onRequestSort={this.handleRequestSort}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  onChangePage={this.handleChangePage}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  isSelected={this.isSelected}/>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={1}></Grid>
          </Grid>
        </div>
      );
    }

    return (
      <div className='Search'>
        <TitleBar title='Search for Availible Devices'/>
        <Grid container spacing={24}>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={5}>
            <Paper style={{width: '100%'}}>
              <SearchTable
                columnData={this.columnData}
                data={this.state.data}
                order={this.state.order}
                orderBy={this.state.orderBy}
                onRowClick={this.handleRowClick}
                onRequestSort={this.handleRequestSort}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                onChangePage={this.handleChangePage}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                isSelected={this.isSelected}/>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5} style={{
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
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
        </Grid>
      </div>
    );
  }
}

export default Search;
