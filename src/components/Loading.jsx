import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

class Loading extends React.Component {
  constructor(props, context) {
    super(props);
  }

  render() {
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
          Make sure you have installed MetaMask are logged into an account.
        </Typography>
      </div>
    </div>
    );
  }
}

export default Loading;
