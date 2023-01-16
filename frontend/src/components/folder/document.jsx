import React from "react";
import { Component } from "react";
import Menu from "./menu";
import "./folder.css";
import RenameDocument from "./renameDocument";
import DeleteDocument from "./deleteDocument";
import { Link, use } from "react-router-dom";

class Document extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMenu: false,
      renaming: false,
      deleting: false,
    };
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.cancelNaming = this.cancelNaming.bind(this);
    this.startNaming = this.startNaming.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  renderRenameForm() {
    if (this.state.renaming == true) {
      return (
        <RenameDocument
          documentName={this.props.name}
          cancelHandler={this.cancelNaming}
          renameHandler={this.props.renameHandler}
        ></RenameDocument>
      );
    }
    if( this.state.deleting == true) {
      return (
        <DeleteDocument
          note={this.props.noteId}
          cancelDeleteHandler={this.cancelDelete}
        ></DeleteDocument>
      )
    }
  }

  renderDropdownMenu() {
    if (this.state.showMenu === true) {
      return <Menu startNamingHandler={this.startNaming} deleteDocumentHandler={this.deleteDocument}></Menu>;
    }
  }

  startNaming() {
    this.setState({
      renaming: true,
    });
  }
  cancelNaming() {
    this.setState({
      renaming: false,
    });
  }
  deleteDocument() {
    this.setState({
      deleting: true,
    });
  }
  cancelDelete() {
    this.setState({
      deleting: false,
    });
  }
  handleMenuClick() {
    this.setState({
      showMenu: !this.state.showMenu,
    });
  }
  render() {
    return (
      <div className="document">
        <div className="documentCard">
          <Link to={`/note/${this.props.noteId}`}>
            <img
              src={require("./file.png")}
              className="documentImage"
              alt="document img"
            />
          </Link>
          <img
            src={require("./hamburger.png")}
            className="documentHamburger"
            onClick={this.handleMenuClick}
            alt=""
          />
        </div>
        {this.renderDropdownMenu()}
        {this.renderRenameForm()}
        <h1 className="documentName"> {this.props.name} </h1>
      </div>
    );
  }
}

export default Document;
