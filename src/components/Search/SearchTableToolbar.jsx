import React from 'react';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

export default function SearchTableToolbar() {
  return (
    <div className='SearchTableToolbar'>
      <Toolbar>
        <div style={{flex: '0 0 auto'}}>
          <Typography variant="title" id="tableTitle">
            Available Devices
          </Typography>
        </div>
        <div style={{flex: '1 1 100%'}}/>
        <div >
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon/>
            </IconButton>
          </Tooltip>
        </div>
      </Toolbar>
    </div>);
}
