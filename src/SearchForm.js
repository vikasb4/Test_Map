import React, {PureComponent} from "react";
import * as dummyLocation from "./dummyData.json"
import * as fs from 'fs';

class SearchForm extends PureComponent{
    
    constructor(){
        super();
        this.state = {
            newIncidentNumber : "",
            newSource: "",
            newDescription: "",
            newType: ""
        };

    }
    writeJsonFile = require('write-json-file');

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }); 
    }

    clearFields = () => {
        this.setState({            
            newIncidentNumber : "",
            newSource: "",
            newDescription: ""
        })
    }

    onSubmit =  (event) =>  {
        // console.log("submit", this.state.newType)
        // console.log(this.state.newSource, this.state.newDescription)
    }

    render() {
        let addForm;
        addForm = (
            <div style={{float:"left", width:`50%`}}>
            <form className="ui form" onSubmit={this.onSubmit}>
              <div style={{float: "left", marginTop:`10%`, marginLeft: `5%`, width: `50%`}}>
                <label>Incident Number</label>
                <input type="text" name="newIncidentNumber" value={this.state.newIncidentNumber} onChange={this.handleChange} />
                <label>Source</label>
                <input type="text" name="newSource" value={this.state.newSource} onChange={this.handleChange}/>
                <label>Description</label>
                <input type="text" name="newDescription" value={this.state.newDescription} onChange={this.handleChange} />
                <div style={{marginTop: `5%`}}>                
                    <input type="submit" className="ui primary button" value="Submit" />
                    <button type="button" className="ui cancel button" style={{marginLeft: `2%`}} onClick={this.clearFields}>Clear</button>
                </div>
              </div>
              <div style={{float: `right`, marginTop:`14%`, marginRight: `10%`}}>
                <div className="ui checkbox">
                    <input type="checkbox" name="newType" value="CCTV" onChange={this.handleChange}/>
                    <label> CCTV</label>
                </div>
                <br/><br/>
                <div className="ui checkbox">
                    <input type="checkbox"  name="newType" value="Crime Scene" onChange={this.handleChange}/>
                    <label> Crime Scene</label>
                </div>
                <br/><br/>
                <div className="ui checkbox">
                    <input type="checkbox"  name="newType" value="Vendor" onChange={this.handleChange}/>
                    <label> Vendor</label>
                </div>

              </div>
            </form>
          </div>
        )
        return addForm;
    }
}

export default SearchForm;