import React from 'react';
import PropTypes from 'prop-types';

export default function ManageDeviceInfo({device}) {
  return (
    <div className='ManageDeviceInfo'>
      {device}
    </div>);
}
ManageDeviceInfo.propTypes = {
  device: PropTypes.object.isRequired,
};
