import React, {Component} from 'react';
import './css/LogForm.css';

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
            <body>
            <h2>CastleStore</h2>
            <form onSubmit={this.handleSubmit}>
                <div className="imgcontainer">
                    <img src="css/castel.png" className="castle"/>
                </div>
                <div className="container">
                    <label>
                        Username :
                        <input type="text" placeholder="Enter Username" value={this.state.name} onChange={this.handleChangeName}/>
                        Password :
                        <input type="password" placeholder="Enter Password" value={this.state.password}
                               onChange={this.handleChangePassword}/>
                    </label>
                    <button type="submit">Login</button>
                </div>
            </form>
            </body>


        )
            ;
    }
}

export default LogForm;
