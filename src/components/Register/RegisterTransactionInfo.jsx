import React from 'react';

import Typography from '@material-ui/core/Typography';

// Stateless component for displaying feedback on the last sent transaction
class RegisterTransactionInfo extends React.Component {
  getErrorText(message) {
    if (typeof message === 'string' || message instanceof String) {
      if (message.includes('User denied transaction signature')) {
        return ': transaction denied in MetaMask';
      }
    }
    if (message.hasOwnProperty('message')) {
      console.log('message.message: ', message.message);
      if (message.message.includes('processed in 240 seconds!')) {
        return ': transactioned timed out; try again';
      }
      if (message.message.includes('transaction underpriced')) {
        return ': gas price not high enough; manually increase in MetaMask';
      }
      if (message.message.includes('revert')) {
        return ': contract error; likely device named already used';
      }
    }
    return '';
  }

  render() {
    let message = null;
    if (this.props.transaction.status != null) {
      if (this.props.transaction.status === 'error') {
        message = <Typography
          variant="subheading"
          align="center"
          style={{color: 'red'}}>
            Transaction returned an error
            {this.getErrorText(this.props.transaction.message)}
        </Typography>;
      } else if (this.props.transaction.status === 'success') {
        message = <Typography
          variant="subheading"
          align="center"
          style={{color: 'green'}}>
            Successfully sent transaction to contract
        </Typography>;
      }
    }

    return (
      <div style={{marginTop: '25px'}}>
        {message}
      </div>);
  }
}

export default RegisterTransactionInfo;
