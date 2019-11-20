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
            dashBoard_apps:[],
            modalCreateApp: false
        }
        this.toggleModalAddApp=this.toggleModalAddApp.bind(this);
        this.addApp=this.addApp.bind(this);
        this.deleteApp=this.deleteApp.bind(this);
        this.editApp=this.editApp.bind(this);
        this.addAppToDashBoard=this.addAppToDashBoard.bind(this);
        this.deleteAppFromDashBoard=this.deleteAppFromDashBoard.bind(this);
        this.getUser();
        this.componentDidMount();
    }

    //send a request to get the user connected

    /**
     *
     */
    getUser(){
        axios.get(APP_URL+'/user',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //update user information states
            .then(item => this.setState(
                {
                    id_user:item.id_user,
                    name_user:item.name_user,
                    mail_user:item.mail_user
                })
            )
            .then(() => this.getAppsCreatedByUser())
            .then(() => this.getAppsOnDashBoard())
            .catch(err => console.log(err))
    }

    //send a request to have apps owned by user
    getAppsCreatedByUser(){
        axios.get(APP_URL+'/user/myapps',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //update apps created by user state 
            .then(items => this.setState({apps_created:items}))
            .catch(err => console.log(err))
    }
    
    //send a request to have apps in dashBoard by user
    getAppsOnDashBoard(){
        axios.get(APP_URL+'/user/myappsondashboard',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(items => this.setState({dashBoard_apps:items}))
            .catch(err => console.log(err))
    }

    //add the app on dashBoard apps list by updating state
    addAppToDashBoard(app){
        this.setState({dashBoard_apps: [...this.state.dashBoard_apps, app]})
    }

    //add the app on created apps list by updating state
    addApp(app){
        this.setState({apps_created: [...this.state.apps_created, app]})
    }

    //edit app on created apps list by updtating state
    editApp(app){
        //for each app created, if it is the app edited, replace it by app on param, else retrieve it the same app
        this.setState({apps_created: this.state.apps_created.map(item => {
            if(item.id_app===app.id_app){
                return app
            }
            else{
                return item
            }
            })})
    }

    //delete the app on dashBoard and created apps list by updating state
    deleteApp(id_app){
        this.setState({
            apps_created:this.state.apps_created.filter(item => item.id_app!==id_app),
            dashBoard_apps:this.state.dashBoard_apps.filter(item => item.id_app!==id_app)})
    }

    //delete the app on dashBoard apps list by updating state

    deleteAppFromDashBoard(id_app){
        this.setState({dashBoard_apps:this.state.dashBoard_apps.filter(item => item.id_app!==id_app)})
    }

    componentDidMount() {
        this.getAppsOnDashBoard();
        this.getAppsCreatedByUser();
        this.getUser()
    }

    //to open and close the AddApp modal
    toggleModalAddApp = () => {
        //when triggered, modalCreateApp state take the opposite value
        this.setState(prevState => ({
            modalCreateApp: !prevState.modalCreateApp
        }))
    }

    render() {
        const closeBtn = <Button className="close" onClick={this.toggleModalAddApp}>&times;</Button>;
        const user_name = this.state.name_user.replace('.',' ');

        return (
            <Container className="App">
                <Row>
                    <Col>
                        <Link to={'/'}><h5>Catalog</h5></Link>
                    </Col>
                    <Col>
                        <h1 style={{margin: "20px 0"}}>{user_name}</h1>
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
                                <CreateOrEditApp handleClose={this.toggleModalAddApp} addApp={this.addApp} item={null} oldLabels={[]}/>
                            </ModalBody>
                        </Modal>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AppList items={this.state.apps_created} id_user={this.state.id_user} editApp={this.editApp} deleteAppFromDashBoard={this.deleteAppFromDashBoard} addAppToDashBoard={this.addAppToDashBoard} deleteApp={this.deleteApp} />
                    </Col>
                </Row>
                <Row>
                    <h2>Applications on your DashBoard</h2>
                </Row>
                <Row>
                    <Col>
                        <AppList items={this.state.dashBoard_apps} id_user={this.state.id_user} deleteAppFromDashBoard={this.deleteAppFromDashBoard} addAppToDashBoard={this.addAppToDashBoard}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Profile;