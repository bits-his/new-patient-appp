import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Col, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap'
import { apiURL } from '../../../redux/actions'
import { _fetchApi2, _postApi } from '../../../redux/actions/api'
import CustomButton from '../../comp/components/Button'

function BankForm({ showForm = true, onSelect = (f) => f }) {
  const location = useLocation()
  const isCashier = location.pathname.includes('review')
  const [form, setForm] = useState({})
  const [bankList, setBankList] = useState([])

  const handleInputChange = ({ target: { name, value } }) =>
    setForm((p) => ({ ...p, [name]: value }))

  const getBankList = () => {
    _fetchApi2(
      `${apiURL()}/bank-accounts?query_type=list`,
      (data) => {
        if (data.results) {
          setBankList(data.results)
        }
      },
      (err) => {
        console.log(err)
      },
    )
  }

  const handleSubmit = () => {
    _postApi(
      `${apiURL()}/bank-accounts/new`,
      { ...form, query_type: 'new' },
      () => {
        getBankList()
      },
    )
  }

  useEffect(() => {
    getBankList()
  }, [])

  return (
    <div>
      {showForm ? (
        <Form>
          <Row>
            <Col>
              <FormGroup>
                <Label>Bank Name</Label>
                <Input
                  type="text"
                  name="bank_name"
                  value={form.bank_name}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Account No.</Label>
                <Input
                  type="number"
                  name="account"
                  value={form.account}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
            {/* <Col>
            <FormGroup>
              <Label>Account Name.</Label>
              <Input
                type="text"
                name="acct_name"
                value={form.acct_name}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Col> */}
            <Col>
              <FormGroup>
                <Label>Code</Label>
                <Input
                  type="text"
                  name="code"
                  value={form.code}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <center>
            <CustomButton
              onClick={handleSubmit}
              className="px-5 mb-2"
              color="primary"
            >
              Click to add new
            </CustomButton>
          </center>
        </Form>
      ) : null}

      {/* {JSON.stringify(bankList)} */}
      <Table size="sm" bordered stripe>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Bank Name</th>
            <th>Account No</th>
            <th>Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bankList.map((item, i) => (
            <tr>
              <td>{i + 1}</td>
              <td>{item.bank_name}</td>
              <td>{item.account_no}</td>
              <td>{item.code}</td>
              <td>
                <CustomButton size="sm" onClick={() => onSelect(item)}>
                  Select
                </CustomButton>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default BankForm
