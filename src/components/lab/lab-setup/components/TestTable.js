import React, { useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { Table } from 'reactstrap'
import ConfirmAction from '../../../comp/alert/ConfirmAction'
import CustomButton from '../../../comp/components/Button'
import { postLabSetup } from '../helper'

function TestTable({
  data = [],
  mode = 'edit',
  handleTableChange = (f) => f,
  addNewRow = (f) => f,
  updateLabChildrenList,
  removeItem=f=>f
}) {
  const [selectedItem, setSelectedItem] = useState({})
  const [warningIsOpen, setWarningIsOpen] = useState(false)

//   const deleteItem = () =>
//     postLabSetup(
//       { subhead: selectedItem.subhead, query_type: 'delete' },
//       () => {
//         updateLabChildrenList(selectedItem.head)
//       },
//     )

  return (
    <>
      <Table striped bordered size="sm">
        <thead>
          <tr>
            <td className="text-center">Test</td>
            <td className="text-center">Unit</td>
            <td className="text-center">Range From</td>
            <td className="text-center">Range To</td>
            <td className="text-center">Gender</td>
            <td className="text-center">Age</td>
            {/* <td>
                      <Button>Add</Button>
                    </td> */}
          </tr>
        </thead>
        {/* {JSON.stringify(data)} */}
        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td className="d-flex flex-direction-row align-items-center">
                <FaTrash
                  color="red"
                  className="mr-1"
                  onClick={() => {
                    removeItem(item)
                    //   toggle()
                    // setWarningIsOpen(true)
                  }}
                />
                {mode === 'edit' ? (
                  <input
                    className="form-control form-control-sm"
                    value={item.description}
                    name="description"
                    onChange={({ target: { name, value } }) =>
                      handleTableChange('description', value, item)
                    }
                  />
                ) : (
                  <span>{item.description}</span>
                )}
              </td>
              <td>
                {mode === 'edit' ? (
                  <input
                    className="form-control form-control-sm"
                    value={item.unit}
                    name="unit"
                    onChange={({ target: { name, value } }) =>
                      handleTableChange('unit', value, item)
                    }
                  />
                ) : (
                  <span>{item.unit}</span>
                )}
              </td>
              <td>
                {mode === 'edit' ? (
                  <input
                    className="form-control form-control-sm"
                    value={item.range_from}
                    name="range_from"
                    onChange={({ target: { name, value } }) =>
                      handleTableChange('range_from', value, item)
                    }
                  />
                ) : (
                  <span>{item.range_from}</span>
                )}
              </td>
              <td>
                {mode === 'edit' ? (
                  <input
                    className="form-control form-control-sm"
                    value={item.range_to}
                    name="range_to"
                    onChange={({ target: { name, value } }) =>
                      handleTableChange('range_to', value, item)
                    }
                  />
                ) : (
                  <span>{item.range_to}</span>
                )}
              </td>
              <td>
                {mode === 'edit' ? (
                  <input
                    className="form-control form-control-sm"
                    value={item.range_gender}
                    name="range_gender"
                    onChange={({ target: { name, value } }) =>
                      handleTableChange('range_gender', value, item)
                    }
                  />
                ) : (
                  <span>{item.range_gender}</span>
                )}
              </td>
              <td>
                {mode === 'edit' ? (
                  <input
                    className="form-control form-control-sm"
                    value={item.range_age}
                    name="range_age"
                    onChange={({ target: { name, value } }) =>
                      handleTableChange('range_age', value, item)
                    }
                  />
                ) : (
                  <span>{item.range_age}</span>
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={6} className="text-right">
              <CustomButton outline onClick={addNewRow}>
                <FaPlus className="mr-1" /> Add Row
              </CustomButton>
            </td>
          </tr>
        </tbody>
      </Table>
      <ConfirmAction
        modal={warningIsOpen}
        setModal={setWarningIsOpen}
        confirmBtnAction={() => removeItem(selectedItem)}
      />
    </>
  )
}

export default TestTable
