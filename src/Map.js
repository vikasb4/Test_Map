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
      mapPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      markerPosition: {
        lat: this.props.center.lat,
        lng: this.props.center.lng
      },
      selected: false,
      newIncidentNumber: "",
      newSource: "",
      newDescription: "",
      newCategory: ""
    };
  }
  /**
   * Get the current address from the default map position and set those values in the state
   */
  componentDidMount() {
    console.log("ComponentDidMount")
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

        // console.log("city", city, area, state);

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
    console.log("shouldComponentUpdate: ", nextProps, nextState)
    if (
      this.state.markerPosition.lat !== this.props.center.lat ||
      this.state.address !== nextState.address ||
      this.state.city !== nextState.city ||
      this.state.area !== nextState.area ||
      this.state.state !== nextState.state
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
  onInfoWindowClose = event => {this.setState({seleted: false})};
  /**
   * When the user types an address in the search box
   * @param place
   */
  onPlaceSelected = place => {
    const address = place.formatted_address,
      addressArray = place.address_components,
      city = this.getCity(addressArray),
      area = this.getArea(addressArray),
      state = this.getState(addressArray),
      latValue = place.geometry.location.lat(),
      lngValue = place.geometry.location.lng(); // Set these values in the state.
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
      }
    });
  };
  // /**
  //  * When the marker is dragged you get the lat and long using the functions available from event object.
  //  * Use geocode to get the address, city, area and state from the lat and lng positions.
  //  * And then set those values in the state.
  //  *
  //  * @param event
  //  */
  onMarkerDragEnd = event => {
    console.log("event", event.latLng.lat(), ",",event.latLng.lng());
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
          state: state ? state : "",
          // markerPosition: {        
          //   lat: newLat,
          //   lng: newLng
          // }
        });
      },
      error => {
        console.error(error);
      }
    );
  };


  render() {
    let tmpData = [...dummyLocation.data]
    tmpData.push("hello")
    console.log(tmpData)
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
            types={["(regions)"]}
          />
          {/*Marker*/}
          {dummyLocation.data.map( location =>
            <Marker
              key={location.properties.INCIDENT_NUMBER}
              draggable={true}
              onDragEnd={this.onMarkerDragEnd}
              position={{
                lat: location.properties.coordinates[0],
                lng: location.properties.coordinates[1]
              }}
              animation={2}
              icon={{
                url: location.properties.TYPE === "CCTV" ? 
                  "http://maps.google.com/mapfiles/ms/icons/red-dot.png" :
                  location.properties.TYPE === "CRIME SCENE"?
                  "http://maps.google.com/mapfiles/ms/icons/green-dot.png":
                  "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
                scaledSize: { width: 45, height: 45 }
              }}

              onClick={() => {
                this.setState({
                  selected: true, 
                  markerPosition: {lat: location.properties.coordinates[0], lng:location.properties.coordinates[1]},
                  address: location.properties.ADDRESS,
                  source: location.properties.SOURCE,
                  claimNumber: location.properties.INCIDENT_NUMBER
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
                <p>{this.state.address}</p>
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
          {/* <div style={{float:"left", width:`50%`}}>
            <form className="ui form" onSubmit={this.onSubmit}>
              <div style={{width: `50%`}}>
                <label>Incident Number</label>
                <input type="text" name="incidentNum" value={this.state.newIncidentNumber} onChange={this.handleChange} />
                <label>Source</label>
                <input type="text" name="source" />
                <label>Description</label>
                <input type="text" name="description" />
              </div>
              <div style={{float: `right`}}>
                <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike"/>
                <label> CCTV</label>
                <input type="checkbox" id="vehicle2" name="vehicle2" value="Car"/>
                <label> Crime Scene</label>
                <input type="checkbox" id="vehicle3" name="vehicle3" value="Boat"/>
                <label> Vendor</label>
              </div>


              <input type="submit" value="Submit" />
              <button type="button" className="ui cancel button" onClick={() => console.log("hello ")}>Clear</button>
            </form>
          </div> */}
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
