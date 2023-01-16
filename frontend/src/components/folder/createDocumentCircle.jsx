import React from "react";
import { Component } from "react";
import "./folder.css"

class CreateDocumentCircle extends Component {
    render(){
        return(
            <div className = "createDocumentCircleContainer" onClick={this.props.handler}>
                <span className = "createDocumentCirclePlus">+</span>
            </div>
        );
    }
}

export default CreateDocumentCircle;