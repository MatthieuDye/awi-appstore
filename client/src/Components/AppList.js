import React, { Component } from 'react'
import { Table } from 'reactstrap';

class AppList extends Component {

    render() {

        const items = this.props.items.map(item => {
            return (
                <tr key={item.id_app}>
                    <th scope="row">{item.id_app}</th>
                    <td>{item.name_app}</td>
                    <td>{item.name_user}</td>
                    <td>{item.rank}</td>
                </tr>
            )
        })

        return (
            <Table responsive hover>
                <thead>
                <tr>
                    <th>ID</th>
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