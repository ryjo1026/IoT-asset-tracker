import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

export default function Loading({error}) {
  let errorHint = '';

  // TODO remove after converted other pages to HOCs
  if (typeof error === 'object') {
    if (error.name === 'NetworkConnectionError') {
      errorHint = 'Make sure you have installed MetaMask and are connected to '+
      'the Ropsten Network.';
    } else if (error.name === 'AccountConnectionError') {
      errorHint = 'Make sure you are logged into an account in MetaMask.';
    } else {
      // Default error
      errorHint = 'Make sure you have installed MetaMask and are logged into an account.';
    }
  } else {
    if (error === 'networkConnection') {
      errorHint = 'Make sure you have installed MetaMask and are connected to '+
      'the Ropsten Network.';
    } else {
      errorHint = 'Make sure you have installed MetaMask and are logged into an account.';
    }
  }

  // TODO back to home button
  return (<div className="Loading">
    <div className="spinner" style={{textAlign: 'center', margin: '50px'}}>
      <CircularProgress/>
    </div>
    <div className="text" style={{
        textAlign: 'center',
        marginLeft: '50px',
        marginRight: '50px',
      }}>
      <Typography variant="headline" align="center"
        style={{fontFamily: 'Abel, sans-serif'}}>
         Attempting to connect to account
      </Typography>
      <div></div>
      <Typography variant="subheading" align="center" color="textSecondary">
        {errorHint}
      </Typography>
    </div>
  </div>
  );
}
Loading.propTypes = {
  error: PropTypes.string.isRequired,
};
