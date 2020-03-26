import React, { PureComponent } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchForm from './SearchForm';
import Map from './Map';

class App extends PureComponent {
  constructor(){
    super()
    this.state = {
      newIncidentNumber : "",
      newSource : "",
      newDescription : "",
      newType : []
    }
  }

  onSubmit = (states) => {
    const {newDescription, newIncidentNumber, newSource, newType} = states
    console.log("APP js", newType);
    this.setState({newDescription, newIncidentNumber, newType, newSource})
  }

  render(){
    const {newDescription, newIncidentNumber, newSource, newType} = this.state
    return (
      <div>
        <SearchForm onSubmit={this.onSubmit}/>
        <Map
          center={{ lat: 43.6532, lng: -79.3832 }}
          height="300px"
          zoom={15}
          newRecord={{newDescription, newIncidentNumber, newSource, newType}}
        />
      </div>
    );
  }

}

export default App;
