import React, { Component } from 'react'
import { Table, Button } from 'reactstrap';
import ModalForm from './Modal'

class DataTable extends Component {

    deleteItem = id_label => {
        let confirmDelete = window.confirm('Delete item forever?')
        if(confirmDelete){
            fetch('http://localhost:3000/label', {
                method: 'delete',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id_label
                })
            })
                .then(response => response.json())
                .then(item => {
                    this.props.deleteItemFromState(id_label)
                })
                .catch(err => console.log(err))
        }

    }

    render() {


        const items = this.props.items.map(item => {
            return (
                <tr key={item.id_label}>
                    <th scope="row">{item.id_label}</th>
                    <td>{item.name_label}</td>
                    <td>
                        <div style={{width:"110px"}}>
                            <ModalForm buttonLabel="Edit" item={item} updateState={this.props.updateState}/>
                            {' '}
                            <Button color="danger" onClick={() => this.deleteItem(item.id_label)}>Del</Button>
                        </div>
                    </td>
                </tr>
            )
        })

        return (
            <Table responsive hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>First</th>
                </tr>
                </thead>
                <tbody>
                {items}
                </tbody>
            </Table>
        )
    }
}

export default DataTable