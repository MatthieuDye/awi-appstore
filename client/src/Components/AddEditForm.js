
import React from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

class AddEditForm extends React.Component {
    state = {
        id_label: 0,
        name_label: ''
    }


    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitFormAdd = e => {
        e.preventDefault()
        fetch('http://localhost:3000/label', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name_label: this.state.name_label
            })
        })
            .then(response => response.json())
            .then(item => {
                if(Array.isArray(item)) {
                    this.props.addItemToState(item[0])
                    this.props.toggle()
                } else {
                    console.log('failure')
                }
            })
            .catch(err => console.log(err))
    }

    submitFormEdit = e => {
        e.preventDefault()
        fetch('http://localhost:3000/label', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_label: this.state.id_label,
                name_label: this.state.name_label
            })
        })
            .then(response => response.json())
            .then(item => {
                if(Array.isArray(item)) {
                    // console.log(item[0])
                    this.props.updateState(item[0])
                    this.props.toggle()
                } else {
                    console.log('failure')
                }
            })
            .catch(err => console.log(err))
    }

    componentDidMount(){
        // if item exists, populate the state with proper data
        if(this.props.item){
            const { id_label, name_label } = this.props.item
            this.setState({ id_label, name_label })
        }
    }

    render() {
        return (
            <Form onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
                <FormGroup>
                    <Label for="name">Label Name</Label>
                    <Input type="text" name="name_label" id="name_label" onChange={this.onChange} value={this.state.name_label === null ? '' : this.state.label} />
                </FormGroup>
                <Button>Submit</Button>
            </Form>
        );
    }
}

export default AddEditForm;