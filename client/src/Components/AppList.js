import React, { Component } from 'react'
import {Table} from 'reactstrap';
import AppDetails from "./AppDetails";
class AppList extends Component {



    render() {

        //for each app, create the AppDetails component with props for edit and delete app, add and remove app from dashboard
        const items = this.props.items!==null?this.props.items.map(item => {
                return (
                    <AppDetails key={item.id_app}
                                item={item}
                                id_user={this.props.id_user}
                                editApp={this.props.editApp}
                                deleteApp={this.props.deleteApp}
                                deleteAppFromDashBoard={this.props.deleteAppFromDashBoard}
                                addAppToDashBoard={this.props.addAppToDashBoard}
                                oldLabels={this.props.labels}/>
                        )
            }):<tr><td>No apps</td></tr>;


        return (
            <Table responsive hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Developed by</th>
                    <th>Rating</th>
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