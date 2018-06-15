import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import TitleBar from '../Common/TitleBar.jsx';
import ManageSearchBar from './ManageSearchBar.jsx';
import ManageDeviceInfo from './ManageDeviceInfo.jsx';
import ManageDeviceError from './ManageDeviceError.jsx';

class ManageContiner extends React.Component {
  state = {
    searchQuery: '',
    data: null,
    device: null,
    transaction: {
      pending: false,
      error: null,
    },
  };

  static propTypes = {
    account: PropTypes.string.isRequired,
    web3: PropTypes.object.isRequired,
    contract: PropTypes.func.isRequired,
    contractAddress: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props);

    this.getAllDeviceData();
  }

  getDeviceByName(name) {
    let dataLength = this.state.data.length;
    for (let i = 0; i < dataLength; i++) {
        if (this.state.data[i].name === name) {
          return this.state.data[i];
        }
    }
    return null;
  }

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

  // TODO abstract to HOC
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

  // SEARCHBAR HANDLERS ----------

  handleQueryChanged = (event) => {
    this.setState({searchQuery: event.target.value});
  }

  handleSearchClicked = () => {
    let device = this.getDeviceByName(this.state.searchQuery);
    this.setState({searchAttempted: true, device: device});
  }

  // DEVICEINFO HANDLERS ----------

  handleAuctionStart = () => {
    const {account, contract, contractAddress} = this.props;
    // Enter transaction pending
    this.setState({transaction: {
      pending: true,
      error: null,
    }});
    contract.at(contractAddress).then((at) => {
      at.startAuction(this.state.device.name, {from: account}).then(() => {
        this.getAllDeviceData();
        this.setState({transaction: {
          pending: false,
          error: null,
        }});
      }).catch((err) => {
        this.setState({transaction: {
          pending: false,
          error: err,
        }});
      });
    });
  }

  handleAuctionEnd = () => {
    const {account, contract, contractAddress} = this.props;
    // Enter transaction pending
    this.setState({transaction: {
      pending: true,
      error: null,
    }});
    contract.at(contractAddress).then((at) => {
      at.endAuction(this.state.device.name, {from: account}).then(() => {
        this.getAllDeviceData();
        this.setState({transaction: {
          pending: false,
          error: null,
        }});
      }).catch((err) => {
        this.setState({transaction: {
          pending: false,
          error: err,
        }});
      });
    });
  }

  handleRefreshClicked = () => {
    this.getAllDeviceData();
    let device = this.getDeviceByName(this.state.searchQuery);
    this.setState({device: device});
  }

  // REACT FUNCTIONS ----------

  render() {
    const {searchQuery,
      searchAttempted,
      device,
      transaction} = this.state;

    let searchResult = null;
    if (searchAttempted && device === null) {
      searchResult = <ManageDeviceError/>;
    } else if (device !== null) {
      searchResult = <ManageDeviceInfo
        device={device}
        onStartClicked={this.handleAuctionStart}
        onEndClicked={this.handleAuctionEnd}
        onRefreshClicked={this.handleRefreshClicked}
        transaction = {transaction}
      />;
    }

    return (
      <div className='ManageContiner'>
        <TitleBar title='Manage Your IoT Device'/>
        <Grid container spacing={40}>
          <Grid item xs={1} sm={3}></Grid>
          <Grid item xs={10} sm={6}>
            <ManageSearchBar
              onSearchClicked={this.handleSearchClicked}
              onQueryChange={this.handleQueryChanged}
              searchQuery={searchQuery}/>
            {searchResult}
          </Grid>
          <Grid item xs={1} sm={3}></Grid>
        </Grid>
      </div>);
  }
}

export default ManageContiner;
