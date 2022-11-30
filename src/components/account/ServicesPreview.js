import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Form } from 'reactstrap'
import { FaTimes, FaPrint } from 'react-icons/fa';
// import './servicespreview.css'
import { LoadingSM } from '../loading';
// import PrintButton from '../ comp/printpreview/PrintButton'

export default function ({
    modal, toggle, className, loading, handleFormSubmit, servicesList=[], serviceDetails
}) {
    const onPrintClick = () => {
        window.frames["print_frame"].document.body.innerHTML = document.getElementById("servicesPreview").innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
        // handleFormSubmit()
    }
    return (
        <Modal isOpen={modal} toggle={toggle} className={className} size="lg">
            <ModalHeader toggle={toggle}>Costing Preview</ModalHeader>
            <ModalBody>
                {/* <PrintButton /> */}
                <div id="servicesPreview">
                <Form>
                    <div>
                        <label>Name of Patient:</label>
                        <label>{serviceDetails.name ? serviceDetails.name : ''}</label>
                    </div>
                    <div>
                        <label>Consulting Doctor:</label>
                        <label>{serviceDetails.doctor ? serviceDetails.doctor : 'Dr. Musa'}</label>
                    </div>
                
                    <div>
                        <label>Telephone:</label>
                        <label>{serviceDetails.phoneNo ? serviceDetails.phoneNo : '07062942291'}</label>
                    </div>
                    <div>
                        <label>Admitted:</label>
                        <label>{serviceDetails.admitted ? serviceDetails.admitted : '05-09-2019'}</label>
                    </div>
                
                    <div>
                        <label>Patient ID:</label>
                        <label>{serviceDetails.accountNo ? serviceDetails.accountNo : ''}</label>
                    </div>
                    <div>
                        <label>Discharge:</label>
                        <label>{serviceDetails.admitted ? serviceDetails.admitted : '14-09-2019'}</label>
                    </div>
                </Form>
                <Table responsive bordered className="table">
                    <thead>
                    <tr className="tr">
                        <th className="th">Services</th>
                        <th className="th">Cost</th>
                        <th className="th">Quantity</th>
                        <th className="th">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {servicesList.length ? servicesList.map((service, index) => {
                        return (
                        <tr key={index} className="tr">
                            <td className="td">{service.service}</td>
                            <td className="td">{service.cost}</td>
                            <td className="td">{service.qtty}</td>
                            <td className="td">{service.amount}</td>
                        </tr>
                        );
                    }) : null}
                    </tbody>
                </Table>
                </div>
            </ModalBody>
            <ModalFooter>
                <iframe title="Print Preview" name="print_frame" width="0" height="0" src="about:blank"></iframe>
                <Button color="primary" onClick={onPrintClick}>
                {loading ? <LoadingSM /> : <><FaPrint style={{marginRight:5}} />Print</>}
                </Button>{' '}
                <Button color="danger" onClick={toggle}><FaTimes style={{marginRight:5}} /> Cancel</Button>
            </ModalFooter>
        </Modal>
    )
}