import React, {PureComponent} from "react";

class SearchForm extends PureComponent{
    
    constructor(){
        super();
        this.state = {
            newIncidentNumber : "",
            newSource: "",
            newDescription: "",
            newType: "",
            radioCheckedV: false,
            radioCheckedCCTV: false,
            radioCheckedVCS: false        
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value }); 
    }

    clearFields = () => {
        this.setState({            
            newIncidentNumber : "",
            newSource: "",
            newDescription: "",
            newType: "",
            radioCheckedV: false,
            radioCheckedCCTV: false,
            radioCheckedVCS: false
        })
    }

    onSubmit =  (event) =>  {
        event.preventDefault();
        const {newDescription, newIncidentNumber, newSource, newType} = this.state;
        this.props.onSubmit({
            newDescription,
            newIncidentNumber,
            newSource,
            newType
        });
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
                    <div className="ui form" style={{float: `right`, marginTop:`14%`, marginRight: `20%`}}>
                        <div className="grouped fields">
                            <div className="field">
                                <div className="ui radio checkbox">
                                    <input type="radio" name="newType"
                                        value="CCTV"
                                        onChange={this.handleChange} 
                                        checked={this.state.radioCheckedCCTV}
                                        onClick={() => this.setState({ radioCheckedCCTV: true, radioCheckedCS: false, radioCheckedV: false })}
                                    />
                                    <label>CCTV</label>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="ui radio checkbox">
                                <input type="radio"
                                    name="newType"
                                    value="CRIME SCENE" 
                                    onChange={this.handleChange} 
                                    checked={this.state.radioCheckedCS}
                                    onClick={() => this.setState({ radioCheckedCS: true, radioCheckedCCTV: false, radioCheckedV: false})}
                                />
                                <label>CRIME SCENE</label>
                            </div>
                        </div>
                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio"
                                 name="newType" 
                                 value="VENDOR" 
                                 onChange={this.handleChange} 
                                 checked={this.state.radioCheckedV}
                                 onClick={() => this.setState({ radioCheckedV: true, radioCheckedCS: false, radioCheckedCCTV: false })}
                                />
                                <label>VENDOR</label>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
        return addForm;
    }
}

export default SearchForm;