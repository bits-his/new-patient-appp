import React, { Component } from 'react';
import { Table } from 'reactstrap';
import { FaTimes } from 'react-icons/fa';

export default class ExpenditureList extends Component {
  render() {
    const { list = [], onDelete = (f) => f, total } = this.props;
    return (
      <div style={{ marginTop: '20px' }}>
        <Table responsive bordered striped>
          <thead>
            <tr>
              <th>Delete</th>
              <th>Description</th>
              <th>Account</th>
              <th>Collected By</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {list.length
              ? list.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(item)}
                      >
                        <FaTimes /> Delete
                      </button>
                    </td>
                    <td>{item.description}</td>
                    <td>{item.accHead}</td>
                    <td>{item.collectedBy}</td>
                    <td>{item.amount}</td>
                  </tr>
                ))
              : null}
            {list.length ? (
              <tr>
                <td />
                <td />
                <td />
                <td />
                <td>Total: {total}</td>
              </tr>
            ) : null}
          </tbody>
        </Table>
      </div>
    );
  }
}
