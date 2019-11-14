import React, { Component } from 'react'
import { Table } from 'reactstrap';
import ModalForm from "./Modal";

class AppList extends Component {

    render() {

        const items = this.props.items.map(item => {
            return (<ModalForm key={item.id_app} buttonLabel="Edit" item={item} updateState={this.props.updateState}/>
            )
        })

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