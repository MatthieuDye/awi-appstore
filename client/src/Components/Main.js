import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import ModalForm from './Modal'
import AppList from "./AppList";

class Main extends Component {
    state = {
        items: [],
        labels: []
    }

    getItems(){
        fetch('http://localhost:3000/app')
            .then(response => response.json())
            .then(items => {
                if(items!==null) {
                    this.setState({items:items})
                }
            })
            .catch(err => console.log(err))
    }

    getLabels(){
        fetch('http://localhost:3000/label')
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
        const itemIndex = this.state.items.findIndex(data => data.id === item.id)
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
                        <h1 style={{margin: "20px 0"}}>CRUD Database</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <AppList items={this.state.items} updateState={this.updateState} deleteItemFromState={this.deleteItemFromState} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ModalForm buttonLabel="Add Item" addItemToState={this.addItemToState}/>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Main