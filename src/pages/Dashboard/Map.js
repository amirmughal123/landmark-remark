import React, { Component } from 'react';
import GoogleMap from "react-google-map";
import GoogleMapLoader from "react-google-maps-loader";

import KEY from '../../../utils';

class LandMap extends Component {

  loadLocations = () => {
    const { notes } = this.props;
    return notes.map(({ location, userName, description }) => {
      return {
        title: userName,
        position: location,
        onLoaded: (googleMaps, map, marker) => {
          // Set Marker animation
          marker.setAnimation(googleMaps.Animation.BOUNCE)

          // Define Marker InfoWindow
          const infoWindow = new googleMaps.InfoWindow({
            content: `
              <div>
                <h4>Username: ${userName}<h4>
                <div>
                  text: ${description}
                </div>
              </div>
            `,
          })

          // Open InfoWindow when Marker will be clicked
          googleMaps.event.addListener(marker, "click", () => {
            infoWindow.open(map, marker)
          })

          // Open InfoWindow directly
          infoWindow.open(map, marker)
        },
      }
    })
  }

  render() {
    const { notes } = this.props;
    return (
      <div className='map'>
        <GoogleMapLoader
          params={{
            key: KEY.API_KEY,
            libraries: "places", // To request multiple libraries, separate them with a comma
          }}
          render={(googleMaps, error) => {
            return (
              googleMaps ?
              <GoogleMap
                googleMaps={googleMaps}
                // You can add and remove coordinates on the fly.
                // The map will rerender new markers and remove the old ones.
                coordinates={this.loadLocations()}
                center={{lat: 43.604363, lng: 1.443363}}
                zoom={8}
                onLoaded={(googleMaps, map) => {
                  map.setMapTypeId(googleMaps.MapTypeId.SATELLITE)
                }}
              />
              :
              <div>Error loading map</div>
            )}}
        />
      </div>
    )
  }
}

export default LandMap;