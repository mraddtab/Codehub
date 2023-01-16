import React from "react";
import { Component } from "react";
import "./folder.css"
import RenameDocument from "./renameDocument";

class Menu extends Component {

    rename(){
        //Need to pass the name of the document that was clicked to menu
        //Need to go into folder page's state.documents and find the index of doucment matching name
        //Need to update that index.
    }

    render() { 
        return (
            <ul className="menuList">
                <li className="menuItem" onClick={this.props.startNamingHandler}>Rename</li>
                <li className="menuItem">Open</li>
                <li className="menuItem" onClick={this.props.deleteDocumentHandler}>Remove</li>
                <li className="menuItem">Share</li>
            </ul>
        );
    }
}

export default Menu;