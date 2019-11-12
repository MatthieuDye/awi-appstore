import React, {Component} from 'react';
import castle from '../castle.jpg';
import {Form, Col, Row, Container,Image} from 'react-bootstrap';
import {APP_URL} from "../environment";
import Cookies from 'universal-cookie';
import axios from "axios";

const cookies = new Cookies();

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleInputChange = (event) => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        return axios.post(APP_URL + '/authenticate', {
            email: this.state.email,
            password: this.state.password
        })
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem('token', res.data);
                    this.props.history.push('/');
                } else {
                    const err = new Error(res.error);
                    throw err;
                }
            })
            .catch(err => {
                console.error(err);
                alert('Error logging in please try again');
            });
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col md={{span: 8, offset: 2}}>
                        <img src={castle} alt="castle" height="400px" />
                    </Col>
                    <Col md={{span: 9, offset: 5}}>
                        <h4>Please Login</h4>
                        <br></br>
                    </Col>
                    <Col md={{span: 8, offset: 4}}>
                        <Form onSubmit={this.onSubmit}>

                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <br></br>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter email"
                                    value={this.state.email}
                                    onChange={this.handleInputChange}
                                    required
                                />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <br></br>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter password"
                                    value={this.state.password}
                                    onChange={this.handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <input type="submit" value="Submit"/>
                        </Form>
                    </Col>
                </Row>

            </Container>
        );
    }
}