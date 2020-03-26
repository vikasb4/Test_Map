import React, {PureComponent} from "react";

class SearchForm extends PureComponent{
    
    constructor(){
        super();
        this.state = {
            newIncidentNumber : "",
            newSource: "",
            newDescription: "",
            newType: [],
            cctvChecked: false,
            csChecked: false,
            vendorChecked: false
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
            newType: [],
            cctvChecked: false,
            csChecked: false,
            vendorChecked: false
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

    buttonDisable = () => {
        const {newIncidentNumber, newSource, newType, newDescription} = this.state;
        return(
            newIncidentNumber === "" ||
            newSource === "" ||
            newDescription === "" ||
            newType.length === 0
        );
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
                            <input type="submit" className="ui primary button" value="Submit" disabled={this.buttonDisable()}/>
                            <button type="button" className="ui cancel button" style={{marginLeft: `2%`}} onClick={this.clearFields}>Clear</button>
                        </div>
                    </div>
                    <div style={{float: `right`, marginTop:`14%`, marginRight: `20%`}}>
                        <div className="ui checkbox">
                            <input type="checkbox" name="newType"
                                value="CCTV"
                                checked={this.state.cctvChecked}
                                onClick={async () => {
                                    let tmpChecked = this.state.cctvChecked;
                                    await this.setState({cctvChecked: !tmpChecked});
                                    let tmpType = [...this.state.newType]
                                    if(this.state.cctvChecked){
                                        tmpType.push("CCTV")
                                        await this.setState({newType: tmpType})
                                    }else{
                                        let filteredType = tmpType.filter( type => {
                                            return type !== "CCTV"
                                        })
                                        await this.setState({newType: filteredType})
                                    }
                                }}
                            />
                            <label>CCTV</label>
                        </div>
                        <br/><br/>
                        <div className="ui checkbox">
                            <input type="checkbox"
                                name="newType"
                                value="CRIME SCENE" 
                                // onChange={this.handleChange} 
                                checked={this.state.csChecked}
                                onClick={async () => {
                                    let tmpChecked = this.state.csChecked
                                    await this.setState({csChecked: !tmpChecked});
                                    let tmpType = [...this.state.newType]
                                    if(this.state.csChecked){
                                        tmpType.push("CRIME SCENE")
                                        await this.setState({newType: tmpType})
                                    }else{
                                        let filteredType = tmpType.filter( type => {
                                            return type !== "CRIME SCENE"
                                        })
                                        await this.setState({newType: filteredType})
                                    }
                                }}                            
                            />
                            <label>CRIME SCENE</label>
                        </div>
                        <br/><br/>
                        <div className="ui checkbox">
                            <input type="checkbox"
                                name="newType" 
                                value="VENDOR" 
                                // onChange={this.handleChange}
                                checked={this.state.vendorChecked}
                                onClick={async () => {
                                    let tmpChecked = this.state.vendorChecked
                                    await this.setState({vendorChecked: !tmpChecked});
                                    let tmpType = [...this.state.newType]
                                    if(this.state.vendorChecked){
                                        tmpType.push("VENDOR")
                                        await this.setState({newType: tmpType})
                                    }else{
                                        let filteredType = tmpType.filter( type => {
                                            return type !== "VENDOR"
                                        })
                                        await this.setState({newType: filteredType})
                                    }
                                }}
                            />
                            <label>VENDOR</label>
                        </div>
                    </div>
                </form>
            </div>
        )
        return addForm;
    }
}

export default SearchForm;