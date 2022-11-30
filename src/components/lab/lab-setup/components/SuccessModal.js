import React from 'react'
import { useHistory } from 'react-router'
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import CustomButton from '../../../comp/components/Button'

function SuccessModal({
  nextPageText = '',
  nextPage = '',
  isOpen = false,
  toggle = (f) => f,
}) {
  const history = useHistory()
  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalBody isOpen={isOpen} toggle={toggle}>
        <div>Your changes have been saved.</div>
      </ModalBody>
      <ModalFooter>
        <CustomButton>Close</CustomButton>
        <CustomButton onClick={() => history.push(nextPage)}>
          {nextPageText}
        </CustomButton>
      </ModalFooter>
    </Modal>
  )
}

export default SuccessModal
