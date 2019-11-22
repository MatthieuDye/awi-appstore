import React, {Component} from 'react'
import {Modal, ModalBody, ModalHeader} from "reactstrap";
import {Container, Row, Col, Navbar, Nav} from 'react-bootstrap'
import axios from "axios";
import {APP_URL} from "../environment";
import AppList from "./AppList";
import {Link} from "react-router-dom";
import CreateOrEditApp from "./CreateOrEditApp";
import Button from "react-bootstrap/Button";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_user: 0,
            name_user: '',
            mail_user: '',
            apps_created: [],
            dashBoard_apps: [],
            modalCreateApp: false
        };

        this.toggleModalAddApp = this.toggleModalAddApp.bind(this);
        this.addApp = this.addApp.bind(this);
        this.deleteApp = this.deleteApp.bind(this);
        this.editApp = this.editApp.bind(this);
        this.addAppToDashBoard = this.addAppToDashBoard.bind(this);
        this.deleteAppFromDashBoard = this.deleteAppFromDashBoard.bind(this);
        this.getUser();
        this.componentDidMount();
    }

    /**
     *getUser: send a request to get the user connected
     */
    getUser() {
        axios.get(APP_URL + '/user', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //update user information states
            .then(item => this.setState(
                {
                    id_user: item.id_user,
                    name_user: item.name_user,
                    mail_user: item.mail_user
                })
            )
            //launch requests to get apps of user and apps on user dashboard
            .then(() => this.getAppsCreatedByUser())
            .then(() => this.getAppsOnDashBoard())
            .catch(err => console.log(err))
    }

    /**
     *getAppsCreatedByUser: send a request to server to have apps owned by user
     */
    getAppsCreatedByUser() {
        axios.get(APP_URL + '/user/myapps', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //update apps created by user state 
            .then(items => this.setState({apps_created: items}))
            .catch(err => console.log(err))
    }

    /**
     * getAppsOnDashboard: send a request to server to have apps in dashBoard by user
     */
    getAppsOnDashBoard() {
        axios.get(APP_URL + '/user/myappsondashboard', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //update state of apps on user dashboard
            .then(items => this.setState({dashBoard_apps: items}))
            .catch(err => console.log(err))
    }

    /**
     * addAppToDashBoard: add the app on dashBoard apps list by updating state
     * @param app: the app added
     */
    addAppToDashBoard(app) {
        this.setState({dashBoard_apps: [...this.state.dashBoard_apps, app]})
    }

    /**
     * addApp: add the app on created apps list by updating state
     * @param app: the app created
     */
    addApp(app) {
        this.setState({apps_created: [...this.state.apps_created, app]})
    }


    /**
     * deleteApp: delete the app on dashBoard and created apps list by updating state
     * @param id_app: the id of app deleted
     */
    deleteApp(id_app) {
        this.setState({
            apps_created: this.state.apps_created.filter(item => item.id_app !== id_app),
            dashBoard_apps: this.state.dashBoard_apps.filter(item => item.id_app !== id_app)
        })
    }

    /**
     * editApp: edit the app on dashBoard and created apps list by updating state
     * @param app: the app edited
     */
    editApp(app) {
        this.setState({
            apps_created: this.state.apps_created.map(item => {
                if (item.id_app !== app.id_app) {
                    return item
                } else {
                    return app
                }
            }),
            dashBoard_apps: this.state.dashBoard_apps.map(item => {
                if (item.id_app !== app.id_app) {
                    return item
                } else {
                    return app
                }
            })
        })
    }

    /**
     * delete the app on dashBoard apps list by updating state
     * @param id_app: id of the app deleted from dashboard
     */
    deleteAppFromDashBoard(id_app) {
        this.setState({dashBoard_apps: this.state.dashBoard_apps.filter(item => item.id_app !== id_app)})
    }

    componentDidMount() {
        this.getAppsOnDashBoard();
        this.getAppsCreatedByUser();
        this.getUser()
    }

    /**
     * toggleModalApp: to open and close the AddApp modal
     */
    toggleModalAddApp = () => {
        //when triggered, modalCreateApp state take the opposite value
        this.setState(prevState => ({
            modalCreateApp: !prevState.modalCreateApp
        }))
    };

    /**
     * handleLogOut: remove the token from storage and redirect to login page
     */
    handleLogOut() {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }

    render() {
        const closeBtn = <Button className="close" onClick={this.toggleModalAddApp}>&times;</Button>;
        const user_name = this.state.name_user.replace('.', ' ');

        return (
            <React.Fragment>

                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand><h4>{user_name}</h4></Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link><Link to={'/'}><h6 style={{color: '#FFFFFF'}}>Catalog</h6></Link></Nav.Link>
                        <Nav.Link onClick={this.handleLogOut.bind(this)}><h6 style={{color: '#FFFFFF'}}>Logout</h6>
                        </Nav.Link>
                    </Nav>
                </Navbar>

                <Container className="App">
                    <br></br>
                    <h1>PROFILE</h1>
                    <br></br>
                    <br></br>

                    <Row>
                        <Col>
                            <h2>Applications you created</h2>
                        </Col>
                        <Col>
                            <Button variant="success" onClick={this.toggleModalAddApp}>Add an App</Button>
                            <Modal isOpen={this.state.modalCreateApp} toggle={this.toggleModalAddApp}
                                   className={this.props.className}>
                                <ModalHeader toggle={this.toggleModalAddApp} close={closeBtn}>ADD AN NEW APP</ModalHeader>
                                <ModalBody>
                                    <CreateOrEditApp handleClose={this.toggleModalAddApp} addApp={this.addApp}
                                                     item={null} oldLabels={[]}/>
                                </ModalBody>
                            </Modal>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <AppList items={this.state.apps_created} id_user={this.state.id_user} editApp={this.editApp}
                                     deleteAppFromDashBoard={this.deleteAppFromDashBoard}
                                     addAppToDashBoard={this.addAppToDashBoard} deleteApp={this.deleteApp}/>
                        </Col>
                    </Row>

                    <br></br>


                    <Row>
                        <h2>Applications on your DashBoard</h2>
                    </Row>
                    <Row>
                        <Col>
                            <AppList items={this.state.dashBoard_apps} id_user={this.state.id_user}
                                     deleteAppFromDashBoard={this.deleteAppFromDashBoard}
                                     addAppToDashBoard={this.addAppToDashBoard}/>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default Profile;