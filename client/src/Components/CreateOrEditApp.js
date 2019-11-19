import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import '../App.css'
import axios from 'axios'
import {APP_URL} from "../environment";
class CreateOrEditApp extends Component {

    constructor(props){
        super(props)
        this.state = {
            id_app: 0,
            name_app: '',
            id_creator: 0,
            name_creator:'',
            description_app: '',
            link_app:'',
            value_select_label: 'choose label',
            labels: [],
            //
            labels_app: this.props.oldLabels?this.props.oldLabels.map(el => el.id_label):[]

        }
        this.deleteLabel=this.deleteLabel.bind(this)
        this.addLabel=this.addLabel.bind(this)
        this.getIdApp=this.getIdApp.bind(this)
        this.createLabelApp=this.createLabelApp.bind(this)
        this.createRating=this.createRating.bind(this)
        this.deleteLabelApp=this.deleteLabelApp.bind(this)

        this.getIdUser()
        this.getLabels()

    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };


    //add the label selected in list of labels of the app (set labels_app state)
    addLabel(event){
        this.setState({value_select_label:event.target.value});
        if(!this.state.labels_app.includes(event.target.value)) {
            this.setState({labels_app: [...this.state.labels_app, event.target.value]})
        }
    }

    //delete the label selected from list of labels of the app (set labels_app state)
    deleteLabel(id_label){
        this.setState({labels_app:this.state.labels_app.filter(id => id!==id_label)})
    }

    //request to server to get id of user connected (set state id_creator)
    getIdUser(){
        axios.get(APP_URL+'/user',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(item => this.setState({id_creator:item.id_user,name_creator:item.name_user}))
            .catch(err => console.log(err))
    }

    //request to server to get all labels (set state labels)
    getLabels(){
        axios.get(APP_URL+'/label')
            .then(response => response.data)
            .then(items => this.setState({labels:items}))
            .catch(err => console.log(err))
    }

    //after the creation of the app, request the server to get its id
    //after the request, create the link with labels and create rating
    getIdApp(){
        axios.get(APP_URL+'/app/'+this.state.name_app,{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(items => {
                items.map(item => {
                    this.setState({id_app:item.id_app})
                    return ''
                })
            })
            .then(() => {
                this.createLabelApp()
            })
            .then(() => this.createRating())
            .catch(err => console.log(err))
    }

    //after getting id app, create a rating
    //after request, app creation is over, push to profile page
    createRating(){
        axios.post(APP_URL+'/user/app/rating', {
            id_user: this.state.id_creator,
            id_app: this.state.id_app,
            rating: 2.5
        },
            {
                headers: {
                    Authorization:'Bearer '+ localStorage.getItem('token')
                }
            })
            .then(this.props.addApp({
                id_app:this.state.id_app,
                name_app:this.state.name_app,
                id_user:this.state.id_creator,
                name_user:this.state.name_creator,
                link_app:this.state.link_app,
                description_app:this.state.description_app,
                rating:2.5
            }))
            .then(this.props.handleClose)
            .catch(err => console.log(err))
    }

    //after getting id app,create link between labels and app
    createLabelApp() {
        this.state.labels_app.filter(el => !this.props.oldLabels.map(el => el.id_label).includes(el)).map(label => {
            if (label !== 'choose label') {
                axios.post(APP_URL + '/app/labels', {
                        id_label: label,
                        id_app: this.state.id_app
                    },
                    {
                        headers: {
                            Authorization:'Bearer '+ localStorage.getItem('token')
                        },
                    })
                    .then(response => response.data)
                    .then(item => {
                        if (Array.isArray(item)) {
                            this.props.addItemToState(item[0])
                        } else {
                            console.log('failure')
                        }
                    })
                    .catch(err => console.log(err))
            }
            return ''
        });
    }

    deleteLabelApp(){
        this.props.oldLabels.filter(el => !this.state.labels_app.includes(el.id_label)).map(label => {
            axios.delete(APP_URL+'/app/'+this.props.item.id_app+'/labels/'+label.id_label,{
                headers:{
                    Authorization:'Bearer '+localStorage.getItem('token')
                }
            })
                .then(response => response.data)
                .catch(err => console.log(err))
        })
    }

    //submit the form of app creation, send a post request to server with data
    submitFormAdd = e => {
        e.preventDefault();
        axios.post(APP_URL+'/app', {
            name_app: this.state.name_app,
            id_creator: this.state.id_creator,
            description_app: this.state.description_app,
            link_app: this.state.link_app
            },
            {
                headers: {
                Authorization:'Bearer '+ localStorage.getItem('token')
                },
            })
            .then(response => response.data)
            .then(() => this.getIdApp())
            .catch(err => console.log(err));

    };

    submitFormEdit = e => {
        console.log(this.props.editApp)
        e.preventDefault();
        axios.put(APP_URL+'/app', {
                id_app:this.state.id_app,
                name_app: this.state.name_app,
                id_creator: this.state.id_creator,
                description_app: this.state.description_app,
                link_app: this.state.link_app
            },
            {
                headers: {
                    Authorization:'Bearer '+ localStorage.getItem('token')
                },
            })
            .then(response => response.data)
            .then(() => this.createLabelApp())
            .then(() => this.deleteLabelApp())
            .then(this.props.handleClose)
            .catch(err => console.log(err));

    };



    componentDidMount(){
        // if item exists, populate the state with proper data
        this.getLabels()
        if(this.props.item){
            const { id_app, name_app,id_creator,description_app,link_app } = this.props.item
            this.setState({ id_app, name_app,id_creator,description_app,link_app })
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
                    {console.log(this.state.labels_app)}
                    <td>{this.state.labels.filter(el => el.id_label.toString()===item.toString()).map(el => {
                        return(el.name_label)})}</td>
                    <td><Button onClick={() => this.deleteLabel(item)}>delete</Button></td>
                </tr>
            )
        });

        return (
            <Form id="createAppForm" onSubmit={
                this.props.item!=null ? this.submitFormEdit : this.submitFormAdd}>
                <FormGroup className="nameAppForm">
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
                <Button >Submit</Button>
            </Form>
        );
    }
}

export default CreateOrEditApp;