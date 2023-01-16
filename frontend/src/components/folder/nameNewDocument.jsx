import React from "react";
import { Component } from "react";
import "./folder.css"

class NameNewDocument extends Component  {

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
      
    //Adds document to folder page with the name entered.
      handleSubmit(event) {
        if(this.state.value.length > 0){
          this.props.addDocumentHandler(this.state.value);
          this.props.cancelHandler();
          event.preventDefault(); 
        }
        else{
          alert("Document Name Can't Be Empty");
        }
      }

    render(){
        return(
            <div className= "newDocumentLayer">
                <form className = "newDocumentForm" action="" >
                    <input type="text" className = "newDocumentInput" onChange={this.handleChange} value={this.state.value} placeholder="Document Name ... "/>
                    <div className="newDocumentButtons"> 
                        <div className="newDocumentCancel" onClick={this.props.cancelHandler}>Cancel</div> 
                        <div className="newDocumentCreate" onClick = {this.handleSubmit}>Create</div>
                    </div>
                </form>
            </div>
        );
    }
}

export default NameNewDocument;