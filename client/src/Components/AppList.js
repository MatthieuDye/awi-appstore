import React, { Component } from 'react'
import { Table } from 'reactstrap';
import ModalForm from "./Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import {APP_URL} from "../environment";

class AppList extends Component {



    render() {


        const items = this.props.items!==null?this.props.items.map(item => {
                return (
                    <ModalForm key={item.id_app} item={item} id_user={this.props.id_user}/>
                        )
            }):'';


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