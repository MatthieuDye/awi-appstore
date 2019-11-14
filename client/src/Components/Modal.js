import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody } from 'reactstrap'
import AddEditForm from './AddEditForm'
import Button from 'react-bootstrap/Button';
import axios from "axios";
import {APP_URL} from "../environment";

class ModalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            added_app: false,
            id_user:0
        }
        this.addAppToDashBoard=this.addAppToDashBoard.bind(this);
        this.deleteAppFromDashBoard=this.deleteAppFromDashBoard.bind(this);

        this.getUser();
    }

    hasDownloadedApp(){
        axios.get(APP_URL+'/user/'+this.state.id_user+'/hasdownloadedapp/'+this.props.item.id_app,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(res => this.setState(
                {
                    added_app:res.hasApp
                })
            )
            .catch(err => console.log(err))
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
                    id_user:item.id_user
                })
            )
            .then(() => this.hasDownloadedApp())
            .catch(err => console.log(err))
    }

    addAppToDashBoard(){
        axios.post(APP_URL+'/user/mydownloadedapps/add',{
            id_user: this.state.id_user,
            id_app: this.props.item.id_app,
            rank: 2.5
        },{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(() => this.setState(
                {
                    added_app:true
                })
            )
            .catch(err => console.log(err))
    }

    deleteAppFromDashBoard(){
        axios.delete(APP_URL+'/user/mydownloadedapps/delete',{
            headers:{
                Authorization:localStorage.getItem('token'),
                id_user: this.state.id_user,
                id_app: this.props.item.id_app,
            }
        },{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(() => this.setState(
                {
                    added_app:false
                })
            )
            .catch(err => console.log(err))
    }


    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }

    render() {
        const closeBtn = <Button className="close" onClick={this.toggle}>&times;</Button>;

        const addBtn =  () => {
            if(this.state.added_app){
                return <Button className="delete" onClick={this.deleteAppFromDashBoard}>Remove from my Dashboard</Button>
            }
            else{
                return <Button className="add" onClick={this.addAppToDashBoard}>Add to my Dashboard</Button>
            }
        }

        return (
                <tr key={this.props.item.id_app} onClick={this.toggle}>
                    <td>{this.props.item.name_app}</td>
                    <td>{this.props.item.name_user}</td>
                    <td>{this.props.item.rank}</td>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle} close={closeBtn}>{this.props.item.name_app}</ModalHeader>
                        <ModalBody>
                            <div>
                                Description : {this.props.item.description_app}<br/>
                                <a href={this.props.item.link_app} target="external"><Button>Download</Button></a><br/>

                                {addBtn()}
                            </div>
                        </ModalBody>
                    </Modal>
                </tr>

        )
    }
}

export default ModalForm