import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import TitleBar from '../Common/TitleBar.jsx';
import ManageSearchBar from './ManageSearchBar.jsx';
import ManageDeviceInfo from './ManageDeviceInfo.jsx';
import ManageDeviceError from './ManageDeviceError.jsx';

class ManageContiner extends React.Component {
  state = {searchQuery: '', data: null, device: null}

  static propTypes = {
    web3: PropTypes.object.isRequired,
    contract: PropTypes.func.isRequired,
    contractAddress: PropTypes.string.isRequired,
  }

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
      return at.numDevices();
    }).then((at, numDevices) => {
      let data = [];
      for (let i = 0; i < numDevices; ++i) {
        at.getDeviceInfo(i).then((device) => data.push(this.getDataFromDevice(device, i)));
      }
      this.setState({data: data});
    });
  }

  // SEARCHBAR HANDLERS ----------

  handleQueryChanged = (event) => {
    this.setState({searchQuery: event.target.value});
  }

  handleSearchClicked = () => {
    let device = this.getDeviceByName(this.state.searchQuery);
    console.log(device);
    this.setState({searchAttempted: true, device: device});
  }

  // REACT FUNCTIONS ----------

  render() {
    const {searchQuery, device, searchAttempted} = this.state;

    let searchResult = null;
    if (searchAttempted && device === null) {
      searchResult = <ManageDeviceError/>;
    } else if (device !== null) {
      searchResult = <ManageDeviceInfo device={device}/>;
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
