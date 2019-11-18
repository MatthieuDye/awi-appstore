import React, { Component } from 'react'
import {Table} from 'reactstrap';
import AppDetails from "./AppDetails";
class AppList extends Component {



    render() {

        const items = this.props.items!==null?this.props.items.map(item => {
                return (
                    <AppDetails key={item.id_app} item={item} id_user={this.props.id_user} editApp={this.props.editApp} deleteAppFromDashBoard={this.props.deleteAppFromDashBoard} addAppToDashBoard={this.props.addAppToDashBoard} deleteApp={this.props.deleteApp} oldLabels={this.props.labels}/>
                        )
            }):<tr><td>No app on your dashBoard</td></tr>;


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