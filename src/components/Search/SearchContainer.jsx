import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import TitleBar from '../Common/TitleBar.jsx';

import SearchTable from './SearchTable.jsx';
import SearchDeviceInfo from './SearchDeviceInfo.jsx';

// State manager for Search page
export default class SearchContainer extends React.Component {
  static propTypes = {
    account: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
    contract: PropTypes.func.isRequired,
    contractAddress: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      selected: null,
      data: [],
      bidAmount: 0,
      submitDisabled: false,
      bidDisabled: false,
    };

    this.getAllDeviceData();
  }

  getShortAccount() {
    return this.props.account.substr(0, 7) + '...';
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

  checkIsSelected = (id) => {
    return (id === this.state.selected);
  }

  handleRequestSort = (order, orderBy) => {
    let data = order === 'desc'
        ? this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1));

    this.setState({data});
  }

  handleRowClick = (event, id) => {
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

  handleBidAmountChange = (event, device) => {
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
    const {contract, contractAddress} = this.props;
    contract.at(contractAddress).then((at) => {
      at.numDevices().then((numDevices) => {
        // Predeclare size for preformance gains?
        let data = [];
        for (let i = 0; i < numDevices; ++i) {
          at.getDeviceInfo(i).then((device) => {
            data.push(this.getDataFromDevice(device, i));
          });
        }
        this.setState({
          data: data,
        });
        console.log(data);
      });
    });
  }

  // REACT FUNCTIONS ----------

  render() {
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
