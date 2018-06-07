import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker}
from 'react-google-maps';

class RegisterLocationPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      position: {
         lat: 0,
         lng: 0,
      },
    };

    // Set default position to DBuilding TODO set to current location
    this.defaultPosition = {
      lat: 55.7108906,
      lng: 13.2106268,
    };
    this.map = this.initMap(this.defaultPosition);

    this.handleLocationChange = this.handleLocationChange.bind(this);
  }

  onPositionChanged() {
    console.log('here');
    // console.log(this.marker.getPosition());
  }

  initMap() {
    return withScriptjs(withGoogleMap((props) =>
      <GoogleMap
        defaultOptions={{
          // Hide some of the controls
          streetViewControl: false,
          mapTypeControl: false,
        }}
        defaultZoom={14}
        defaultCenter={this.defaultPosition}>
        <Marker position={this.defaultPosition}
          draggable={true}
          ref={(input) => this.marker = input}
          onPositionChanged={this.onPositionChanged}/>
      </GoogleMap>
    ));
  }

  handleLocationChange({position, address}) {
    // Set new location
    this.setState({position});
  }

  render() {
    return (
      <div className='RegisterLocationPicker'>
        <this.map
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{height: '100%'}} />}
          containerElement={<div style={{height: '500px'}} />}
          mapElement={<div style={{height: '100%'}} />}/>
      </div>);
  }
}

export default RegisterLocationPicker;
