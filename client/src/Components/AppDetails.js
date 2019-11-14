import React, { Component } from 'react'
import {Col, Container, Row} from "reactstrap";
import axios from "axios";
import {APP_URL} from "../environment";

class AppDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            id_app: 0,
            name_app: this.props.match.params.userId,
            name_creator: '',
            mail_creator:'',
            description_app: '',
            link_app:'',
            labels_app: [],
            rank_app: 0,
            owner:false
        }
    }

    getApp(){
        axios.get(APP_URL+'/app/'+this.state.name_app,{
            headers:{Authorization:localStorage.getItem('token')}
        })
            .then(response => response.data)
            .then(item => {
                if(item!==null) {
                    this.setState(
                        {
                            id_app:item.id_app,
                            name_creator:item.name_creator,
                            description_app:item.description_app,
                            link_app:item.link_app,
                            rank_app:item.rank_app,
                            labels_app:item.labels_app
                        })
                }
            })
            .catch(err => console.log(err))
    }

    render() {

        return (
            <Container className="App">
                <Row>
                    <Col>
                        <h1>{this.props.name_app}</h1>
                    </Col>
                </Row>
                <Row>

                </Row>
            </Container>
        )
    }
}

export default AppDetails;