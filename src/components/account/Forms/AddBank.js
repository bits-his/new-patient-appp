import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import CustomButton from '../../comp/components/Button'
import RadioGroup from '../../comp/components/RadioGroup'
import { formatNumber } from '../../utils/helpers'
import BankForm from './BankForm'

function AddBank({
  modal,
  toggle,
  onSelect,
  selectedItem = {},
  setSelectedItem = (f) => f,
  // setModeOfPayment = (f) => f,
  processPayment = (f) => f,
}) {
  const submit = (c, d = {}) => {
    let item = {
      ...selectedItem,
      bank_name: d.account_no,
    }

    processPayment(item)

    // console.log(c,d)
    // (account) => {
    // console.log(d.account_no, c.reference_no)
    // handleTable(
    //   'modeOfPayment',
    //   selected.modeOfPayment,
    //   selected.reference_no,
    // )
    // handleTable(
    //   'bank_name',
    //   d.account_no,
    //   selected.reference_no,
    // )
    // setSelected((p) => ({ ...p, bank_name: d.account_no }))

    // toggle()
    // }
  }
  return (
    <div>
      <Modal isOpen={modal} fade={true} toggle={toggle} size="lg">
        <ModalHeader toggle={toggle}>Payment Information</ModalHeader>
        <ModalBody>
          {/* {JSON.stringify(selectedItem)} */}

          <div className="pb-5 row">
            <span className="col-md-3">
              <span className="d-block">
                <strong>Patient Info:</strong>
              </span>
              <span className="d-block">
                <strong>Total Service Amount:</strong>
              </span>
              <span className="d-block">
                <strong>Discount:</strong>
              </span>
              <span className="d-block">
                <strong>Total Amount Paid:</strong>
              </span>
            </span>
            <span className="col-md-9">
              <span className="d-block">
                {selectedItem.fullname} ({selectedItem.client_id})
              </span>
              <span className="d-block">
                ₦{formatNumber(selectedItem.total_amount)}
              </span>
              <span className="d-block">
                ₦{formatNumber(selectedItem.discount_amount)}
              </span>
              <span className="d-block">
                ₦{formatNumber(selectedItem.paid)}
              </span>
            </span>

            {/* <span className="d-block">
              <strong>Total Amount Paid:</strong> ₦
              {formatNumber(selectedItem.paid)}
            </span> */}
          </div>
          <RadioGroup
            name="modeOfPayment"
            label="Select Mode of Payment"
            options={[
              { label: 'Cash', name: 'Cash' },
              { label: 'Bank', name: 'Bank' },
              { label: 'POS', name: 'POS' },
            ]}
            value={selectedItem.modeOfPayment}
            // onChange={(name, value) => console.log(name, value)}
            onChange={(name, value) =>
              setSelectedItem((p) => ({ ...p, modeOfPayment: value }))
            }
          />

          {selectedItem.modeOfPayment === 'Bank' ||
          selectedItem.modeOfPayment === 'POS' ? (
            <BankForm showForm={false} onSelect={submit} />
          ) : null}
          <center className="mt-2">
            {selectedItem.modeOfPayment === 'Cash' ? (
              <CustomButton className="px-4" onClick={submit}>
                Submit
              </CustomButton>
            ) : null}
          </center>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default AddBank
