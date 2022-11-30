import React from 'react';
import { Table, Button, FormGroup } from 'reactstrap';
// import { Button as CustomButton } from '../components';
import { FiSend } from 'react-icons/fi';

function ItemsList({
  list = [],
  handleEdit = (f) => f,
  handleDelete = (f) => f,
  setSelectedIndex = 0,
  loading = false,
  submit = (f) => f,
}) {
  if (list.length) {
    return (
      <>
        <Table size="sm" bordered>
          <thead>
            <tr>
              <th className="text-center">S/N</th>
              <th className="text-center">Item Category</th>
              <th className="text-center">Item Code</th>

              <th className="text-center">Cost price</th>
              <th className="text-center">Quantity</th>
              <th className="text-center">Selling Price</th>
              {/* <th>individual Price</th> */}
              <th className="text-center">Action</th>
            </tr>
          </thead>
          {/* {JSON.stringify(selectedIndex)} */}
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.itemType}</td>
                <td className="text-center">{item.itemCode}</td>
                <td className="text-right">{item.price}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">{item.individualPrice}</td>
                {/* <td>{item.individualPrice}</td> */}
                <td>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => {
                      // handleEdit;
                      // setSelectedIndex(index);
                      handleEdit(item);
                      setSelectedIndex(index);
                    }}
                    style={{ marginRight: '20px' }}>
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    color="danger"
                    onClick={() => handleDelete(index)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <FormGroup className="offset-md-4 offset-lg-4 col-md-4 col-lg-4 d-flex flex-direction-row justify-content-center">
          <Button loading={loading} onClick={submit}>
            <FiSend /> Submit
          </Button>
        </FormGroup>
      </>
    );
  }

  return null;
}

export default ItemsList;
