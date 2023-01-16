import React from "react";
import { Component } from "react";
import "./folder.css"
import NameNewDocument from "./nameNewDocument";

class CreateDocument extends Component {

    render() { 
        return (
            <div className='createDocumentCard' onClick = {this.props.handler}>
                <img className = "createDocumentImage" src={require("./newFile.png")}  alt="" />
            </div>
            
        );
    }
}
export default CreateDocument;