import React, {Component} from 'react';
import './App.css';
import App from "./App";

class LogForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            password: '',
        };
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    handleChangePassword(event) {
        this.setState({password: event.target.value});
    }


    handleSubmit(event) {
        //ici il faudrait appeler API pour changer de page
        //alert('on a appyue sur le bout envoyer    ' + this.state.name);
        //event.preventDefault();
        fetch("http://localhost:9000/startAPI")
            .then(res => res.text())
            .then(res => this.setState({apiResponse: res}));
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username :
                    <input value={this.state.name} onChange={this.handleChangeName}/>
                    Password :
                    <input value={this.state.password} onChange={this.handleChangePassword}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>

        );
    }
}

export default LogForm;
