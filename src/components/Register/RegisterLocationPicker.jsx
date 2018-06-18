import React from 'react';
import PropTypes from 'prop-types';
import {compose, withProps, lifecycle} from 'recompose';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';

let keys = {};
try {
  keys = require('./keys.json');
} catch (error) {
  keys['GOOGLE_MAPS'] =
  'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places';
}

// TODO use best practices instead of recompose (react-google-maps docs are very sloppy)
export default class RegisterLocationPicker extends React.Component {
  constructor(props, context) {
    super(props);

    // Set default position to DBuilding TODO set to current location
    const defaultPosition = {
      lat: 55.7108906,
      lng: 13.2106268,
    };

    this.MapComponent = compose(
        withProps({
          googleMapURL: keys.GOOGLE_MAPS,
          loadingElement: <div style={{height: '100%'}}/>,
          containerElement: <div style={{height: '600px'}}/>,
          mapElement: <div style={{height: '100%'}}/>,
        }),
        lifecycle({
            componentWillMount() {
                const refs = {};

                this.setState({
                  position: null,
                  onMarkerMounted: (ref) => {
                    refs.marker = ref;
                    if (refs.marker !== null) {
                      const position = refs.marker.getPosition();
                      this.props.onMarkerPositionChange(position);
                    }
                  },
                  onPositionChanged: () => {
                    const position = refs.marker.getPosition();
                    this.props.onMarkerPositionChange(position);
                  },
                });
            },
        }),
        withScriptjs,
        withGoogleMap
    )((props) =>
        <GoogleMap defaultOptions={{
              // Hide some of the controls
              streetViewControl: false,
              mapTypeControl: false,
            }}
            defaultZoom={14}
            defaultCenter={defaultPosition}>
          <Marker position={defaultPosition}
            draggable={true}
            ref={props.onMarkerMounted}
            onPositionChanged={props.onPositionChanged}/>
        </GoogleMap>);
  }

  handlePositionChange(position) {
    let newDevice = this.props.device;
    newDevice['location'] = position.toString();
    this.props.onLocationChange(newDevice);
  }

  render() {
    return <this.MapComponent onMarkerPositionChange={(pos) => this.handlePositionChange(pos)}/>;
  }
}
RegisterLocationPicker.propTypes = {
  device: PropTypes.object,
  onLocationChange: PropTypes.func,
  onMarkerMounted: PropTypes.func,
  onMarkerPositionChange: PropTypes.func,
  onPositionChanged: PropTypes.func,
};
