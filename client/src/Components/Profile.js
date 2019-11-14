import React, { Component } from 'react'
import {Col, Container, Row} from "reactstrap";
import axios from "axios";
import {APP_URL} from "../environment";
import AppList from "./AppList";

class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
            id_user: 0,
            name_user: '',
            mail_user:'',
            apps_created:[],
            apps_downloaded:[]
        }
        this.getUser()
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

    render() {
        return (
            <Container className="App">
                <Row>
                    <Col>
                        <h1 style={{margin: "20px 0"}}>{this.state.name_user}</h1>
                    </Col>
                </Row>
                <Row>
                    <h2>Applications you created</h2>
                </Row>
                <Row>
                    <Col>
                        <AppList items={this.state.apps_created} />
                    </Col>
                </Row>
                <Row>
                    <h2>Applications on your Dashboard</h2>
                </Row>
                    <Col>
                        <AppList items={this.state.apps_downloaded}/>
                    </Col>
            </Container>
        )
    }
}

export default Profile;