import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// A Search bar and submit button to get devices from the contract by their name
export default function ManageSearchBar({onSearchClicked, onQueryChange, searchQuery}) {
  return (<div className='ManageSearchBar' style={{display: 'flex', alignItems: 'center'}}>
    <TextField
      id="full-width"
      label="Device Name"
      value={searchQuery}
      onChange={onQueryChange}
      helperText="Enter the name of the device you would like to manage"
      margin="normal"
      style={{width: '70%', marginRight: '10%'}}
      onKeyPress={(ev) => {
        if (ev.key === 'Enter') {
          onSearchClicked();
          ev.preventDefault();
        }
      }}
    />
    <Button variant="raised"
      color="primary"
      style={{textTransform: 'none',
      width: '10%',
      height: '50%',
      float: 'right',
      verticalAlign: 'middle',
      }}
      onClick={onSearchClicked}>
      Search
    </Button>
  </div>);
}
ManageSearchBar.propTypes = {
  onSearchClicked: PropTypes.func.isRequired,
  onQueryChange: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
};
