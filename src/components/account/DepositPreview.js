import React from 'react';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';

// import './print.css';

class Preview extends React.Component {
    onPrintClick=()=>{
        window.frames["print_frame"].document.body.innerHTML = document.getElementById("depositPrint").innerHTML;
        window.frames["print_frame"].window.focus();
        window.frames["print_frame"].window.print();
    }
    render(){
        const { modal, toggle, depositForm, resetDepositForm } = this.props;
        return ( 
            <Modal size="lg" isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={resetDepositForm}>Preview Deposit</ModalHeader>
                <ModalBody>
                    <div id="depositPrint">
                        <h5>Patient Deposit</h5>
                        <h6>Transaction Details</h6>
                        <div>
                            <label>Date:</label>
                            <label>{depositForm.date ? depositForm.date : null}</label>
                        </div>
                        <div>
                            <label>Name:</label>
                            <label>{depositForm.name ? depositForm.name : null}</label>
                        </div>
                        <div>
                            <label>Account Number:</label>
                            <label>{depositForm.accountNo ? depositForm.accountNo : null}</label>
                        </div>
                        <div>
                            <label>Receipt Number:</label>
                            <label>{depositForm.receiptNo ? depositForm.receiptNo : null}</label>
                        </div>
                        <div>
                            <label>Amount:</label>
                            <label>{depositForm.amount ? depositForm.amount : null}</label>
                        </div>                        
                    </div>
                </ModalBody>
                <ModalFooter>
                    <iframe name="print_frame" width="0" height="0" src="about:blank" title="print"></iframe>
                    <Button color="primary" onClick={this.onPrintClick}>Print</Button>
                    <Button color="danger" onClick={resetDepositForm} >Back</Button>   
                </ModalFooter>
            </Modal>  
        )
    }
}

Preview.defaultProps = {
    
}

export default Preview;