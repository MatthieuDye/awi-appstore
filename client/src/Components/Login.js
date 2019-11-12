import React, { Component } from 'react';
import {APP_URL} from "../environment";
import Cookies from 'universal-cookie';
import axios from "axios";
const cookies = new Cookies();

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email : '',
            password: ''
        };
    }
    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmit = (event) => {
        event.preventDefault();

        return axios.post(APP_URL+'/authenticate',{
            email:this.state.email,
            password:this.state.password
        })
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem('token',res.data);
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
            <form onSubmit={this.onSubmit}>
                <h1>Login Below!</h1>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    required
                />
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}