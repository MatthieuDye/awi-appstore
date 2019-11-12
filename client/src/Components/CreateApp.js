
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import '../App.css'
import * as env_variable from '../environment'
import axios from 'axios'
class CreateApp extends Component {

    constructor(props){
        super(props)
        this.state = {
            id_app: 0,
            name_app: '',
            id_creator: 1,
            description_app: '',
            link_app:'',
            value_select_label: 'choose label',
            labels: [],
            labels_app: []
        }
        this.deleteLabel=this.deleteLabel.bind(this)
        this.addLabel=this.addLabel.bind(this)
        this.getIdApp=this.getIdApp.bind(this)
        this.createLabelApp=this.createLabelApp.bind(this)
        this.createRank=this.createRank.bind(this)


    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };


    addLabel(event){
        this.setState({value_select_label:event.target.value})
        this.setState({labels_app:[...this.state.labels_app,event.target.value]})
    }

    deleteLabel(id_label){
        this.setState({labels_app:this.state.labels_app.filter(id => id!==id_label)})
    }

    getLabels(){
        axios.get(env_variable.APP_URL+'/label')
            .then(response => response.data)
            .then(items => this.setState({labels:items}))
            .catch(err => console.log(err))
    }

    getIdApp(){
        axios.get(env_variable.APP_URL+'/app/'+this.state.name_app,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(items => {
                items.map(item => {
                    this.setState({id_app:item.id_app})
                    return ''
                })
            })
            .then(() => this.createLabelApp())
            .then(() => this.createRank())
            .catch(err => console.log(err))
    }

    createRank(){
        axios.post(env_variable.APP_URL+'/rank', {
            id_user: this.state.id_creator,
            id_app: this.state.id_app,
            rank: 2.5
        },
            {
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            })
            .then(response => response.data)
            .catch(err => console.log(err))
    }

    createLabelApp() {
        this.state.labels_app.map(label => {
            if(label!=='choose label') {
                axios.post(env_variable.APP_URL+'/label_app', {
                        id_label: label,
                        id_app: this.state.id_app
                    },
                    {
                        headers: {
                            Authorization:localStorage.getItem('token')
                        },
                })
                    .then(response => response.data)
                    .then(item => {
                        if (Array.isArray(item)) {
                            this.props.addItemToState(item[0])
                            this.props.toggle()
                        } else {
                            console.log('failure')
                        }
                    })
                    .catch(err => console.log(err))
            }
            return ''
        });
}


    submitFormAdd = e => {
        e.preventDefault();
        axios.post(env_variable.APP_URL+'/app', {
            name_app: this.state.name_app,
            id_creator: this.state.id_creator,
            description_app: this.state.description_app,
            link_app: this.state.link_app
            },
            {
                headers: {
                Authorization: localStorage.getItem('token')
                },
            })
            .then(response => response.data)
            .then(() => this.getIdApp())
            .catch(err => console.log(err));

    };



    componentDidMount(){
        // if item exists, populate the state with proper data
        this.getLabels()
        if(this.props.item){
            const { id_app, name_app,id_creator,description_app,link_app,labels } = this.props.item
            this.setState({ id_app, name_app,id_creator,description_app,link_app,labels })
        }
    }

    render() {
        //all labels for app are options of the select form
        const labels = this.state.labels.map(item => {
            return (
                <option key={item.id_label} value={item.id_label} >{item.name_label}</option>
            )
        });

        // show all labels selected
        const labels_selected = this.state.labels_app.map(item => {
            return (
                <tr key={item}>
                    <td>{this.state.labels.filter(el => el.id_label.toString()===item).map(el => {return(el.name_label)})}</td>
                    <td><button onClick={() => this.deleteLabel(item)}>delete</button></td>
                </tr>
            )
        });

        return (
            <Form id="createAppForm" onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}>
                <FormGroup class="nameAppForm">
                    <Label for="name">App Name</Label><br/>
                    <Input type="text" name="name_app" id="name_app" onChange={this.onChange} value={this.state.name_app === null ? '' : this.state.name_app} />
                </FormGroup>
                <FormGroup>
                    <Label for="description">App Description</Label><br/>
                    <Input type="textarea" name="description_app" id="description_app" onChange={this.onChange} value={this.state.description_app === null ? '' : this.state.description_app} />
                </FormGroup>
                <FormGroup>
                    <Label for="link">App Link</Label><br/>
                    <Input type="text" name="link_app" id="link_app" onChange={this.onChange} value={this.state.link_app === null ? '' : this.state.link_app} />
                </FormGroup>
                <FormGroup>
                    <Label for="labels">App labels</Label><br/>
                    <select value={this.state.value_select_label} onChange={this.addLabel}>
                        <option value={this.state.value_select_label}>choose label(s)</option>
                        {labels}
                    </select>
                    </FormGroup>
                <table>
                    <thead>
                        <tr><th>Label Selected</th></tr>
                    </thead>
                    <tbody>
                    {labels_selected}
                    </tbody>
                </table>
                <Button>Submit</Button>
            </Form>
        );
    }
}

export default CreateApp;