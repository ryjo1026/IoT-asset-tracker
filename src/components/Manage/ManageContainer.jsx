import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import TitleBar from '../Common/TitleBar.jsx';
import ManageSearchBar from './ManageSearchBar.jsx';

class ManageContiner extends React.Component {
  state = {searchQuery: ''}

  static propTypes = {
    web3: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props);
  }

  // CONTRACT FUNCTIONS ----------

  // SEARCHBAR HANDLERS ----------

  handleQueryChanged = (event) => {
    this.setState({searchQuery: event.target.value});
  }

  handleSearchClicked = (event) => {
    console.log(this.state.searchQuery);
  }

  // REACT FUNCTIONS ----------

  render() {
    const {searchQuery} = this.state;

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
          </Grid>
          <Grid item xs={1} sm={3}></Grid>
        </Grid>
      </div>);
  }
}

export default ManageContiner;
