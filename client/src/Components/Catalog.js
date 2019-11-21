import React, {Component} from 'react'
import {Container, Row, Col, Navbar, Nav} from 'react-bootstrap'
import AppList from "./AppList";
import axios from 'axios';
import {APP_URL} from "../environment";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";

/**
 * Catalog Component which show the catalog page with all apps
 */
class Catalog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_user: 0,
            items: []
        };

        this.getUser();
        this.getItems();
    }

    /**
     * send a request to server to get the user connected
     */
    getUser() {
        axios.get(APP_URL + '/user', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //update id_user state with id_user retrieved by request
            .then(item => this.setState(
                {
                    id_user: item.id_user
                })
            )
            .catch(err => console.log(err))
    }

    /**
     * send a request to server to get all apps
     */
    getItems() {
        axios.get(APP_URL + '/app', {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
        })
            .then(response => response.data)
            //update apps state with apps retrieved by request
            .then(items => {
                if (items !== null) {
                    this.setState({items: items})
                }
            })
            .catch(err => console.log(err))
    }

    handleLogOut() {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }


    componentDidMount() {
        this.getItems();
        this.getUser();

    }

    render() {
        return (

            <React.Fragment>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand><h4>CastelStore</h4></Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link><Link to={'/profile'}><h6 style={{color: '#FFFFFF'}}>Profile</h6></Link></Nav.Link>
                        <Nav.Link onClick={this.handleLogOut.bind(this)}><h6 style={{color: '#FFFFFF'}}>Logout</h6>
                        </Nav.Link>
                    </Nav>
                </Navbar>

                <Container className="App">
                    <br></br>
                    <h1>CATALOG</h1>
                    <br></br>
                    <Row>
                        <Col>
                            <AppList items={this.state.items} id_user={this.state.id_user}/>
                        </Col>
                    </Row>

                </Container>
            </React.Fragment>
        )
    }
}

export default Catalog