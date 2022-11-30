import React from 'react'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CustomButton from '../../../comp/components/Button'

function IncompletePaymentAlert({ info, isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        Please complete Patient Transaction
      </ModalHeader>
      <ModalBody>
        <div>
          <b>{info.name}</b> has pending transactions amounting to{' '}
          <b>N{Math.abs(info.balance)}</b>. Please complete the pending payment
          to print this result.
        </div>
      </ModalBody>
      <ModalFooter>
        <CustomButton color="warning" onClick={toggle}>
          Close
        </CustomButton>
      </ModalFooter>
    </Modal>
  )
}

export default IncompletePaymentAlert
