import React, { Component } from 'react'
import {Col, Container, Modal, ModalBody, ModalHeader, Row} from "reactstrap";
import axios from "axios";
import {APP_URL} from "../environment";
import AppList from "./AppList";
import {Link} from "react-router-dom";
import CreateOrEditApp from "./CreateOrEditApp";
import Button from "react-bootstrap/Button";

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            id_user: 0,
            name_user: '',
            mail_user:'',
            apps_created:[],
            apps_downloaded:[],
            modalCreateApp: false
        }
        this.toggleModalAddApp=this.toggleModalAddApp.bind(this);
        this.addApp=this.addApp.bind(this);
        this.deleteApp=this.deleteApp.bind(this);
        this.editApp=this.editApp.bind(this);
        this.addAppToDashBoard=this.addAppToDashBoard.bind(this);
        this.deleteDownloadedApp=this.deleteDownloadedApp.bind(this);
        this.getUser();
        this.componentDidMount();
    }


    getUser(){
        axios.get(APP_URL+'/user',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(item => this.setState(
                {
                    id_user:item.id_user,
                    name_user:item.name_user,
                    mail_user:item.mail_user
                })
            )
            .then(() => this.getAppsCreatedByUser())
            .then(() => this.getAppsDownloadedByUser())
            .catch(err => console.log(err))
    }

    getAppsCreatedByUser(){
        axios.get(APP_URL+'/user/myapps',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(items => this.setState({apps_created:items}))
            .catch(err => console.log(err))
    }

    getAppsDownloadedByUser(){
        axios.get(APP_URL+'/user/mydownloadedapps',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(items => this.setState({apps_downloaded:items}))
            .catch(err => console.log(err))
    }

    addAppToDashBoard(app){
        this.setState({apps_downloaded: [...this.state.apps_downloaded, app]})
    }

    addApp(app){
        this.setState({apps_created: [...this.state.apps_created, app]})
    }

    editApp(app){
        this.setState({apps_created: this.state.apps_created.map(item => {
            if(item.id_app===app.id_app){
                return app
            }
            else{
                return item
            }
            })})
    }

    deleteApp(id_app){
        this.setState({
            apps_created:this.state.apps_created.filter(item => item.id_app!==id_app),
            apps_downloaded:this.state.apps_downloaded.filter(item => item.id_app!==id_app)})
    }

    deleteDownloadedApp(id_app){
        this.setState({apps_downloaded:this.state.apps_downloaded.filter(item => item.id_app!==id_app)})
    }

    componentDidMount() {
        this.getAppsDownloadedByUser()
        this.getAppsCreatedByUser()
        this.getUser()
    }

    toggleModalAddApp = () => {
        this.setState(prevState => ({
            modalCreateApp: !prevState.modalCreateApp
        }))
    }

    render() {
        const closeBtn = <Button className="close" onClick={this.toggleModalAddApp}>&times;</Button>;


        return (
            <Container className="App">
                <Row>
                    <Col>
                        <Link to={'/'}><h5>Profile</h5></Link>
                    </Col>
                    <Col>
                        <h1 style={{margin: "20px 0"}}>{this.state.name_user}</h1>
                    </Col>
                    <Col></Col>
                </Row>
                <Row>
                    <Col>
                        <h2>Applications you created</h2>
                    </Col>
                    <Col>
                        <Button onClick={this.toggleModalAddApp}>Add an App</Button>
                        <Modal isOpen={this.state.modalCreateApp} toggle={this.toggleModalAddApp} className={this.props.className}>
                            <ModalHeader toggle={this.toggleModalAddApp} close={closeBtn}>Add an App</ModalHeader>
                            <ModalBody>
                                <CreateOrEditApp handleClose={this.toggleModalAddApp} addApp={this.addApp} item={null} oldLabels={null}/>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AppList items={this.state.apps_created} id_user={this.state.id_user} editApp={this.editApp} deleteDownloadedApp={this.deleteDownloadedApp} addAppToDashBoard={this.addAppToDashBoard} deleteApp={this.deleteApp} />
                    </Col>
                </Row>
                <Row>
                    <h2>Applications on your Dashboard</h2>
                </Row>
                <Row>
                    <Col>
                        <AppList items={this.state.apps_downloaded} id_user={this.state.id_user} deleteDownloadedApp={this.deleteDownloadedApp} addAppToDashBoard={this.addAppToDashBoard}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Profile;