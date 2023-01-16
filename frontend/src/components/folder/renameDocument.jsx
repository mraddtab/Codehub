import React from "react";
import { Component } from "react";
import "./folder.css"

class RenameDocument extends Component  {

    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      //Updates state.value with each key press
      handleChange(event) {
        this.setState({value: event.target.value});
      }
      
      //Renames the document
      handleSubmit(event) {
        if(this.state.value.length == 0){
          alert("Document name can't be empty")
        }
        else{
          this.props.renameHandler(this.props.documentName, this.state.value)
          this.props.cancelHandler();
        }
      }

    render(){
        return(
            <div className= "newDocumentLayer">
                <form className = "newDocumentForm" action="" >
                    <input type="text" className = "newDocumentInput" onChange={this.handleChange} value={this.state.value} placeholder= {this.props.documentName}/>
                    <div className="newDocumentButtons"> 
                        <div className="newDocumentCancel" onClick={this.props.cancelHandler}>Cancel</div> 
                        <div className="newDocumentCreate" onClick = {this.handleSubmit}>Rename</div>
                    </div>
                </form>
            </div>
        );
    }
}

export default RenameDocument;