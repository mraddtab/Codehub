import React, { Fragment } from "react";
import { Component } from "react";
import "./folder.css"
import CreateDocumentCircle from "./createDocumentCircle";
import CreateDocument from "./createDocument";
import Document from "./document";
import Menu from "./menu.jsx"
import NameNewDocument from "./nameNewDocument";
import NavBar from "../navBar/NavBar";
class Folder extends Component {

    constructor(props) {
        super(props);
        this.createDocumentHandler = this.createDocumentHandler.bind(this);
        this.cancelNaming = this.cancelNaming.bind(this);
        this.addDocument = this.addDocument.bind(this);
        this.renameDocument = this.renameDocument.bind(this);
        this.filterDocuments = this.filterDocuments.bind(this);
        this.cancelFilterDocuments = this.cancelFilterDocuments.bind(this);
        this.startFilterDocuments = this.startFilterDocuments.bind(this);
    }
    state = {  
        documents: [],
        renaming: "false",
        filtering: "false",
        proxyDocuments: []
    };

    componentDidMount() {
        const token = localStorage.getItem("token");
        fetch(process.env.REACT_APP_API + "/notes", {
            method: "GET",
            headers: { authorization: `Bearer ${token}` }
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            this.setState({
                documents: data
            })
        })
        .catch(error => {
            console.log(error);
        });
    }

    prependDocument(name){
        this.setState(this.state.documents.unshift({name})) // this is going into this.state -> documents -> {prepending a document}. 
    }
    
    createDocumentHandler(){
        this.setState({
            renaming:"true"
        })
    }
    cancelNaming(){
        this.setState({
            renaming:"false"
        })
    }

    addDocument(documentName){
        const token = localStorage.getItem("token");

        fetch(process.env.REACT_APP_API + "/notes", {
            method: "POST",
            headers: { 
                authorization : `Bearer ${token}`,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ filename: documentName })
        })
        .then(res => {
            return res.json();
        })
        .then(data => {
            this.setState({
                documents: this.state.documents.concat([data])
            })
        })
        .catch(error => {
            console.log(error);
        });
    }


    renameDocument(oldName, newName){
        if(this.state.documents.includes(oldName)){
            const index = this.state.documents.indexOf(oldName);
            const id = this.state.documents[index].id;
            // fetch(process.env.REACT_APP_API + "/notes/"

            // )
            // .then(

            // )
            // .then(

            // )
            // .catch()

            // this.state.documents[index] = newName;
            // this.setState({
            //     documents: this.state.documents 
            // })
        }
    }

    startFilterDocuments(){
        this.setState({
            filtering: "true"
        })
    }
    cancelFilterDocuments(){
        this.setState({
            filtering: "false"
        })
    }
    filterDocuments(name){
        let proxy = this.state.documents.filter(doc => doc.filename === name);
        this.setState({
            proxyDocuments: proxy
        });
    }
    renderDocuments(){
        if(this.state.documents.length === 0){
            return(
                <>
                <NavBar></NavBar>
                <CreateDocument handler={this.createDocumentHandler}> </CreateDocument>
                </>

            )
        }
        else{
            if(this.state.filtering == "false"){
                return(
                    <>
                        <NavBar cancelFilter = {this.cancelFilterDocuments} startFilter = {this.startFilterDocuments}  handleFilter = {this.filterDocuments} documents = {this.state.documents} ></NavBar>
                        { this.state.documents.map( (document, i) => (<Document key={i} renameHandler = {this.renameDocument} name={document.filename} noteId={document._id}> </Document>) )}
                        <CreateDocumentCircle handler = {this.createDocumentHandler}></CreateDocumentCircle>
                    </>
                )
            }
            else{
                return(
                    <>
                        <NavBar cancelFilter = {this.cancelFilterDocuments} startFilter = {this.startFilterDocuments} handleFilter = {this.filterDocuments} documents = {this.state.documents} ></NavBar>
                        { this.state.proxyDocuments.map( (document, i) => (<Document key={i} renameHandler = {this.renameDocument} name={document.filename} noteId={document._id}> </Document>) )}
                        <CreateDocumentCircle handler = {this.createDocumentHandler}></CreateDocumentCircle>
                    </>
                )
            }

        }

    }


    renderNaming(){
        if(this.state.renaming === "true"){
            return <NameNewDocument cancelHandler = {this.cancelNaming} addDocumentHandler = {this.addDocument}></NameNewDocument>
        }
    }

    render() { 
        return (
            <div className = "folder" >
                {this.renderDocuments()}
                {this.renderNaming()}
            </div>
        );
    }
}
 
export default Folder;