import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default function ManageDeviceError() {
  return (
    <div className='ManageDeviceError'>
      <Card style={{marginTop: '50px'}}>
        <CardContent style={{textAlign: 'center'}}>
          <Typography variant="headline" component="h2"
            style={{color: '#e74c3c'}}>
            Device not found
          </Typography>
          <Typography variant="subheading" color="textSecondary">
            Make sure that you spelled the name of the device correctly and that it has been
            correctly registered to the contract.
          </Typography>
        </CardContent>
      </Card>
    </div>);
}
