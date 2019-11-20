import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import AppList from "./AppList";
import axios from 'axios';
import {APP_URL} from "../environment";
import {Link} from "react-router-dom";
import Button from "react-bootstrap/Button";

/**
 * Catalog Component which show the catalog page with all apps
 */
class Catalog extends Component {
    constructor(props){
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
    getUser(){
        axios.get(APP_URL+'/user',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //update id_user state with id_user retrieved by request
            .then(item => this.setState(
                {
                    id_user:item.id_user
                })
            )
            .catch(err => console.log(err))
    }

    /**
     * send a request to server to get all apps
     */
    getItems(){
        axios.get(APP_URL+'/app',{
            headers:{Authorization:'Bearer '+localStorage.getItem('token')}
        })
            .then(response => response.data)
            //update apps state with apps retrieved by request
            .then(items => {
                if(items!==null) {
                    this.setState({items:items})
                }
            })
            .catch(err => console.log(err))
    }

    handleLogOut() {
        localStorage.removeItem('token');
        this.props.history.push('/login');
    }


    componentDidMount(){
        this.getItems();
        this.getUser();

    }

    render() {
        return (
            <Container className="App">
                <Row>
                    <Col>
                        <Link to={'/profile'}><h5>Profile</h5></Link>
                    </Col>
                    <Col>
                        <h1 style={{margin: "20px 0"}}>CastelStore</h1>
                    </Col>
                    <Col><Button onClick={this.handleLogOut.bind(this)}>Logout</Button></Col>
                </Row>

                <Row>
                    <Col>
                        <AppList items={this.state.items} id_user={this.state.id_user} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Catalog