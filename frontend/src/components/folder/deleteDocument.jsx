import React from "react";
import { Component } from "react";
import "./folder.css"

class DeleteDocument extends Component  {

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
        console.log(this.props.note);

        const token = localStorage.getItem("token");
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', authorization: `Bearer ${token}`  },
          body: JSON.stringify({ commentId: this.props.note })
        };
        fetch(process.env.REACT_APP_API + "/document", requestOptions)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Something went wrong');
          })
          .catch((error) => console.log(error))
        this.props.cancelDeleteHandler();
        window.location.reload(true);
      }

    render(){
        return(
            
            <div className= "deleteDocumentLayer">
                <div className = "deleteDocumentForm" action="" >
                    <label className="deleteDocumentInput">Permanently delete this document?</label>
                    <div className="newDocumentButtons"> 
                        <div className="newDocumentCancel" onClick={this.props.cancelDeleteHandler}>Cancel</div> 
                        <div className="newDocumentCreate" onClick = {this.handleSubmit}>Delete</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default DeleteDocument;