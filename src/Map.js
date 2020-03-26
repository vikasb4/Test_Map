import React from "react";
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  InfoWindow,
  Marker
} from "react-google-maps";
import * as dummyLocation from "./dummyData.json"
import Autocomplete from "react-google-autocomplete";
import Geocode from "react-geocode";
Geocode.setApiKey("AIzaSyB0F5K2kf6hXig1dU0HGlRzKcnPWs270OY");
Geocode.enableDebug();

function isEquivalent(a, b) {
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);
  if (aProps.length != bProps.length) {
      return false;
  }
  for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
          return false;
      }
  }
  return true;
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      city: "",
      area: "",
      state: "",
      source: "",
      claimNumber: "",
      description: "",
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      selected: false,
      incidents: [...dummyLocation.data],
      refEntry: {}
    };
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    Geocode.fromLatLng(
      this.state.mapPosition.lat,
      this.state.mapPosition.lng
    ).then(
      response => {
        const address = response.results[0].formatted_address,
          addressArray = response.results[0].address_components,
          city = this.getCity(addressArray),
          area = this.getArea(addressArray),
          state = this.getState(addressArray);

        this.setState({
          address: address ? address : "",
          area: area ? area : "",
          city: city ? city : "",
          state: state ? state : ""
        });
      },
      error => {
        console.error(error);
      }
    );
  }
  /**
   * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
   *
   * @param nextProps
   * @param nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state ||
      (this.props.newRecord !== nextProps.newRecord)
    ) {
      return true;
    } else if (this.props.center.lat === nextProps.center.lat) {
      return false;
    }
  }
  /**
   * Get the city and set the city input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getCity = addressArray => {
    let city = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_2" === addressArray[i].types[0]
      ) {
        city = addressArray[i].long_name;
        return city;
      }
    }
  };
  /**
   * Get the area and set the area input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getArea = addressArray => {
    let area = "";
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0]) {
        for (let j = 0; j < addressArray[i].types.length; j++) {
          if (
            "sublocality_level_1" === addressArray[i].types[j] ||
            "locality" === addressArray[i].types[j]
          ) {
            area = addressArray[i].long_name;
            return area;
          }
        }
      }
    }
  };
  /**
   * Get the address and set the address input value to the one selected
   *
   * @param addressArray
   * @return {string}
   */
  getState = addressArray => {
    let state = "";
    for (let i = 0; i < addressArray.length; i++) {
      for (let i = 0; i < addressArray.length; i++) {
        if (
          addressArray[i].types[0] &&
          "administrative_area_level_1" === addressArray[i].types[0]
        ) {
          state = addressArray[i].long_name;
          return state;
        }
      }
    }
  };
  /**
   * And function for city,state and address input
   * @param event
   */
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  /**
   * This Event triggers when the marker window is closed
   *
   * @param event
   */
  onInfoWindowClose = event => {this.setState({selected: false})};
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = place => {
    console.log(place);
    if (place.address_components) {
      const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng(); // Set these values in the state.
      let newAdded = {
        "INCIDENT_NUMBER": "789456",
        "TYPE": "",
        "SOURCE": address,
        "DESCRIPTION": city + "," + area + "," + state,
        "coordinates": [latValue , lngValue]
      }
      let tmpMarkers = this.state.incidents;
      tmpMarkers.push(newAdded);
      this.setState({
        address: address ? address : "",
        area: area ? area : "",
        city: city ? city : "",
        state: state ? state : "",
        markerPosition: {
          lat: latValue,
          lng: lngValue
        },
        mapPosition: {
          lat: latValue,
          lng: lngValue
        },
        incidents: tmpMarkers
      });
    }
  };

addIncident(newIncident, ref) {
  let incidentList = this.state.incidents;
  incidentList.push(newIncident);
  this.setState({incidents: incidentList,
  refEntry: ref});
}

  render() {
    let tmpReceived = this.props.newRecord;
    const {newIncidentNumber,newType, newSource, newDescription} = tmpReceived;
    if(newIncidentNumber && newType && newSource && newDescription && !isEquivalent(tmpReceived, this.state.refEntry)){
      let newAdded = {
        "INCIDENT_NUMBER": newIncidentNumber,
        "TYPE": newType,
        "SOURCE": newSource,
        "DESCRIPTION": newDescription,
        "coordinates": [this.state.mapPosition.lat , this.state.mapPosition.lng]
      }
      this.addIncident(newAdded, tmpReceived);
    }
    const AsyncMap = withScriptjs(
      withGoogleMap(props => (
        <GoogleMap
          defaultZoom={this.props.zoom}
          defaultCenter={{
            lat: this.state.mapPosition.lat,
            lng: this.state.mapPosition.lng
          }}
        >
          {/* For Auto complete Search Box */}
          <Autocomplete
            style={{
              width: "800px",
              height: "40px",
            }}
            onPlaceSelected={this.onPlaceSelected}
            types
            componentRestrictions={{ country: "ca" }}
          />
          {/*Marker*/}
          {this.state.incidents.map((location, index) =>
            <Marker
              key={location.INCIDENT_NUMBER}
              draggable={true}
              onDragEnd={event => {
                let newLat = event.latLng.lat(),
                  newLng = event.latLng.lng(),
                  addressArray = [];
                Geocode.fromLatLng(newLat, newLng).then(
                  response => {
                    const address = response.results[0].formatted_address,
                      addressArray = response.results[0].address_components,
                      city = this.getCity(addressArray),
                      area = this.getArea(addressArray),
                      state = this.getState(addressArray);
                    this.setState({
                      address: address ? address : "",
                      area: area ? area : "",
                      city: city ? city : "",
                      state: state ? state : ""
                    });
                  },
                  error => {
                    console.error(error);
                  }
                );
                let newIncidents = this.state.incidents;
                newIncidents[index].coordinates = [newLat, newLng];
                this.setState({incidents: newIncidents});
              }}
              position={{
                lat: location.coordinates[0],
                lng: location.coordinates[1]
              }}
              animation={2}
              icon={{
                url: location.TYPE === "CCTV" ? 
                  "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" :
                  location.TYPE === "CRIME SCENE"?
                  "http://maps.google.com/mapfiles/ms/icons/green-dot.png":
                  location.TYPE === "VENDOR"?
                  "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png":
                  "http://maps.google.com/mapfiles/ms/icons/red-dot.png" ,
                scaledSize: { width: 45, height: 45 }
              }}

              onClick={() => {
                this.setState({
                  selected: true, 
                  markerPosition: {lat: location.coordinates[0], lng:location.coordinates[1]},
                  address: location.ADDRESS,
                  source: location.SOURCE,
                  claimNumber: location.INCIDENT_NUMBER,
                  description: location.DESCRIPTION
                })
              }}
            />
          )}
          {/* InfoWindow on top of marker */}
          { 
            this.state.selected && (
            <InfoWindow
              onClose={this.onInfoWindowClose}
              position={{
                lat: this.state.markerPosition.lat + 0.0018,
                lng: this.state.markerPosition.lng
              }}
            >
              <div>
                <h4>Incident Number: {this.state.claimNumber}</h4>
                <p>Source: {this.state.source}</p>
                <p>Description: {this.state.description}</p>
              </div>
            </InfoWindow>)
          }
        </GoogleMap>
      ))
    );
    let map;
    if (this.props.center.lat !== undefined) {
      map = (
        <div>
          <div style={{float: "right", width: `50%`}}>
            <AsyncMap
              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0F5K2kf6hXig1dU0HGlRzKcnPWs270OY&v=3.exp&libraries=geometry,drawing,places"
              loadingElement={<div>loading......</div>}
              containerElement={<div></div>}
              mapElement={<div style={{ height: `800px`, width: `800px`}} />}
            />
          </div>
        </div>
      );
    } else {
      map = <div style={{ height: this.props.height }} />;
    }
    return map;
  }
}

export default Map;
