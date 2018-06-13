import React from 'react';

import Grid from '@material-ui/core/Grid'

import TitleBar from '../Common/TitleBar.jsx';
import ManageSearchBar from './ManageSearchBar.jsx';

class ManageContiner extends React.Component {
  handleSearchClicked(event) {
    console.log('click');
  }

  render() {
    return (
      <div className='ManageContiner'>
        <TitleBar title='Manage Your IoT Device'/>
        <Grid container spacing={40}>
          <Grid item xs={1} sm={3}></Grid>
          <Grid item xs={10} sm={6}>
            <ManageSearchBar onSearchClicked={this.handleSearchClicked}/>
          </Grid>
          <Grid item xs={1} sm={3}></Grid>
        </Grid>
      </div>);
  }
}

export default ManageContiner;
