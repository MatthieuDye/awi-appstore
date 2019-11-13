import React, { Component } from 'react'
import {Col, Container, Row} from "reactstrap";

class AppDetails extends Component {

    constructor(props){
        super(props);
        this.state = {
            id_app: 0,
            name_app: '',
            id_creator: 0,
            description_app: '',
            link_app:'',
            labels_app: [],
            rank_app: 0
        }
    }

    render() {

        return (
            <Container className="App">
                <Row>
                    <Col>
                        <h1>{this.state.name_app}</h1>
                    </Col>
                </Row>
                <Row>

                </Row>
            </Container>
        )
    }
}

export default AppDetails;