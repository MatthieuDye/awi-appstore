import React, { Component } from 'react'
import {Modal, ModalBody, ModalHeader, Table} from 'reactstrap';
import ModalForm from "./Modal";
import CreateOrEditApp from "./CreateOrEditApp";
import Button from "react-bootstrap/Button";
class AppList extends Component {



    render() {



        const items = this.props.items!==null?this.props.items.map(item => {
                return (
                    <ModalForm key={item.id_app} item={item} id_user={this.props.id_user} editApp={this.props.editApp} deleteDownloadedApp={this.props.deleteDownloadedApp} addAppToDashBoard={this.props.addAppToDashBoard} deleteApp={this.props.deleteApp} oldLabels={this.props.labels}/>
                        )
            }):<tr><td>No app on your dashboard</td></tr>;


        return (
            <Table responsive hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Developed by</th>
                    <th>Rank</th>
                </tr>
                </thead>
                <tbody>
                {items}
                </tbody>
            </Table>
        )
    }
}

export default AppList