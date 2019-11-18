import React, { Component } from 'react'
import { Table } from 'reactstrap';

class LabelList extends Component {

    render() {

        const items = this.props.items.map(item => {
            return (<tr key={item.id_label}><td>{item.name_label}</td></tr>
            )
        })

        return (
            <Table responsive hover>
                <thead>
                <tr>
                    <th>Labels</th>
                </tr>
                </thead>
                <tbody className='labelsList'>
                {items}
                </tbody>
            </Table>
        )
    }
}

export default LabelList