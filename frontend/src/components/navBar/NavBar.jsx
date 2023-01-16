import React, { Component } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
export default class NavBar extends Component {

  constructor(props) {
    super(props);
    this.state = {searchedDocument: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkFilter = this.checkFilter.bind(this);
  }


  handleChange(event) {
    this.setState({searchedDocument: event.target.value});

  }
  handleSubmit(event) {
      this.checkFilter();
      this.props.handleFilter(this.state.searchedDocument);
  }

  checkFilter(){
    if(this.state.searchedDocument.length > 1){
      this.props.startFilter();
      console.log(this.state.searchedDocument);
    }
    else if(this.state.searchedDocument.length === 0){
      console.log("not filtering");
      this.props.cancelFilter();
    }
  }
  render() {
    return (
      <div className="Navbar">
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        ></link>{" "}
        <div className="leftSide">
          <div className="dreamworktitle">CODEHUB</div>
          <div className="search-box">
            <input
              className="searchBar"
              type="text"
              placeholder=" Search for projects, teammates..."
              onChange={this.handleChange}
            />
            <button className="fa fa-search" onClick={this.handleSubmit}></button>
          </div>
        </div>
        <div className="rightSide">
          <div className="dropdown">
            <button className="dropbtn">≡</button>
            <div className="dropdown-content">
            <Link to="/login" onClick={ () => { 
                localStorage.removeItem("token");
                window.location.reload();
              }
             }>Log out</Link>
          </div>
          </div>
        </div>
      </div>
    );
  }
}