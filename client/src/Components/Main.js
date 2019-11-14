import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import AppList from "./AppList";
import axios from 'axios';
import {APP_URL} from "../environment";


class Main extends Component {
    state = {
        items: [],
        labels: []
    }

    getItems(){
        axios.get(APP_URL+'/app',{
            headers:{Authorization:localStorage.getItem('token')}
        })
            .then(response => response.data)
            .then(items => {
                if(items!==null) {
                    this.setState({items:items})
                }
            })
            .catch(err => console.log(err))
    }

    getLabels(){
        return axios.get(APP_URL+'/label',{
            headers:{Authorization:localStorage.getItem('token')}
        })
            .then(response => response.json())
            .then(items => this.setState({labels:items}))
            .catch(err => console.log(err))
    }


    addItemToState = (item) => {
        this.setState(prevState => ({
            items: [...prevState.items, item]
        }))
    }

    updateState = (item) => {
        const itemIndex = this.state.items.findIndex(data => data.id === item.id);
        const newArray = [
            // destructure all items from beginning to the indexed item
            ...this.state.items.slice(0, itemIndex),
            // add the updated item to the array
            item,
            // add the rest of the items to the array from the index after the replaced item
            ...this.state.items.slice(itemIndex + 1)
        ]
        this.setState({ items: newArray })
    }

    deleteItemFromState = (id) => {
        const updatedItems = this.state.items.filter(item => item.id !== id)
        this.setState({ items: updatedItems })
    }

    componentDidMount(){
        this.getItems()
        this.getLabels()

    }

    render() {
        return (
            <Container className="App">
                <Row>
                    <Col>
                        <h1 style={{margin: "20px 0"}}>CastelStore</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AppList items={this.state.items} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Main