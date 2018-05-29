import React from 'react';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import './TitleBar.css';

// Stateless TitleBar componenet for return to Home and page name
class TitleBar extends React.Component {
  render() {
    return (
      <div className='TitleBar'>
        <Button component={Link} to="/"
          variant="outlined" color="primary"
          style={{margin: '25px', textTransform: 'none'}}>
          Back to Home
        </Button>
        <Typography variant="display3" color="primary" align="center">
          {this.props.title}
        </Typography>
      </div>);
  }
}

export default TitleBar;
