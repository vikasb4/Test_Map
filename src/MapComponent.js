import React from 'react';

class MapComponent extends React.Component {
  render() {
    return (
      <div className="ui container">
        <div>
          <h1>This is the map component</h1>
        </div>
        <p>
          the cat name from the state is : {this.props.newRecord.newDescription}
        </p>
      </div>
    );
  }
}
export default MapComponent;
