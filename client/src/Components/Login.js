import React, {Component} from 'react';
import castle from '../assets/castle.jpg';
import {Col, Row, Container, Button} from 'react-bootstrap';
import axios from "axios";
import {APP_FRONT_URL, APP_URL} from "../environment";

export default class Login extends Component {

    constructor(props){
        super(props);
    }

    /**
     * authPolytech: redirect on polytech authentication page
     * @returns {string}
     */
    authPolytech = () => {
        let state = Math.random().toString(36).substring(7);
        localStorage.setItem("state", state);
        const clientId = "566e7eb0-0081-4171-9cef-de9e92e84901";
        const redirectUri = encodeURI(APP_FRONT_URL+'/login');
        return `http://oauth.igpolytech.fr/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`
    };

    /**
     * authenticate: send a request to server to add the user if not exists and verify token
     */
    authenticate(){
        axios.get(APP_URL+'/user/authenticate',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .catch(err => err)
    }

    /**
     * componentDidMount: launch the authentication on page opening
     */
    componentDidMount() {
        if (this.props.location.search) {
            const params = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (_, key, value) => {
                params[key] = value;
            });
            //callback of polytech auth
            if(params.state !== undefined && (params.state.localeCompare(localStorage.getItem("state")))) {
                const data = {client_id: "566e7eb0-0081-4171-9cef-de9e92e84901", code: params.code};
                axios
                    .post("https://oauth.igpolytech.fr/token", data)
                    .then(res =>localStorage.setItem('token',res.data.access_token))
                    .then(() => this.authenticate())
                    .then(() => this.props.history.push('/profile'))
                    .catch(err => err)
            }
        }
    }

    render() {


        return (
            <Container>
                <Row>
                    <Col md={{span: 8, offset: 2}}>
                        <img src={castle} alt="castle" height="400px" />
                    </Col>
                    <Col md={{span: 9, offset: 5}}>
                        <a href={this.authPolytech()}><Button variant="info" >Please Login</Button></a>
                    </Col>
                </Row>

            </Container>
        );
    }
}