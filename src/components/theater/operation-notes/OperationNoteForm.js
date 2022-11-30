import React, { useState } from 'react'
import { FormGroup, Collapse } from 'reactstrap'
import { RadioGroup } from 'evergreen-ui'
import { FiPlusSquare, FiMinusSquare } from 'react-icons/fi'
import Surgeons from './Surgeons'
import Anesthetists from './Anesthetists'
import ScrubNurses from './ScrubNurses'
import NewPrescriptionRequest from '../../doc_dash/visits/components/PrescriptionRequest'

function OperationNoteForm({
  formdata = {},
  handleInputChange = (f) => f,
  // toggleSurgeonsCollapse=f=>f,
  handleAdd = (f) => f,
  handleCheck = (f) => f,
  handleRemove = (f) => f,
  handleAnestheticAgenChange = (f) => f,
  patientInfo,
  emptyPrescription = {},
  handlePrescriptionChange = (f) => f,
}) {
  const [anesthetistsCollapseOpen, setAnesthetistsCollapseOpen] = useState(true)
  const [surgeonsCollapseOpen, setSurgeonsCollapseOpen] = useState(true)

  const toggleSurgeonsCollapse = () => setSurgeonsCollapseOpen((p) => !p)

  const toggleAnesthetistsCollapse = () =>
    setAnesthetistsCollapseOpen((p) => !p)

  return (
    <>
      <FormGroup row>
        <div className="col-md-6 col-lg-6">
          <label>Diagnosis</label>
          <input
            type="text"
            name="diagnosis"
            value={formdata.diagnosis ? formdata.diagnosis : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 col-lg-6">
          <label>Procedure</label>
          <input
            type="text"
            name="surgery"
            value={formdata.surgery ? formdata.surgery : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </FormGroup>

      <FormGroup>
        <div style={{ cursor: 'pointer' }} onClick={toggleSurgeonsCollapse}>
          <>
            {surgeonsCollapseOpen ? (
              <FiMinusSquare
                size={15}
                style={{ marginTop: 5, marginRight: 5 }}
              />
            ) : (
              <FiPlusSquare
                size={15}
                style={{ marginTop: 5, marginRight: 5 }}
              />
            )}
          </>
          <span>Surgeons</span>
        </div>
        <Collapse isOpen={surgeonsCollapseOpen}>
          <Surgeons
            handleAdd={handleAdd}
            handleRemove={handleRemove}
            formdata={formdata}
            handleCheck={handleCheck}
          />
        </Collapse>
      </FormGroup>

      <FormGroup>
        <div style={{ cursor: 'pointer' }} onClick={toggleAnesthetistsCollapse}>
          <>
            {anesthetistsCollapseOpen ? (
              <FiMinusSquare
                style={{ marginTop: 5, marginRight: 5 }}
                size={15}
              />
            ) : (
              <FiPlusSquare
                size={15}
                style={{ marginTop: 5, marginRight: 5 }}
              />
            )}
          </>
          <span>Anesthetists</span>
        </div>
        <Collapse isOpen={anesthetistsCollapseOpen}>
          <Anesthetists
            formdata={formdata}
            handleCheck={handleCheck}
            handleAdd={handleAdd}
            handleRemove={handleRemove}
          />
        </Collapse>
      </FormGroup>

      <FormGroup>
        <div>
          {/* <label>Anesthetic Agent</label> */}
          <RadioGroup
            label="Anesthetic Agent"
            value={formdata.anesthetic}
            options={[
              { label: 'GA', value: 'GA' },
              { label: 'LA', value: 'LA' },
              { label: 'Spinal/Epidural', value: 'Spinal/Epidural' },
            ]}
            onChange={handleAnestheticAgenChange}
          />
        </div>
      </FormGroup>
      <FormGroup row>
        <ScrubNurses
          formdata={formdata}
          handleCheck={handleCheck}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
        />
        {/* <div className="row">
                    <div className="col-md-6">
                      <CheckBoxItem
                        handleCheck={handleCheck}
                        name="scrubNurse"
                        label="Mal. Ibrahim"
                        value={formdata.scrubNurse ? formdata.scrubNurse : []}
                      />
                      <AdditionalTextBox
                        handleAdd={handleAdd}
                        handleRemove={handleRemove}
                        name="scrubNurse"
                        value={formdata.scrubNurse ? formdata.scrubNurse : []}
                      />
                    </div>
                  </div> */}
        <div className="col-md-6 col-lg-6">
          <label>Blood Pints Given</label>
          <input
            type="text"
            name="pintsGiven"
            value={formdata.pintsGiven ? formdata.pintsGiven : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </FormGroup>
      <FormGroup row>
        <div className="col-md-6 col-lg-6">
          <label>Estimated Blood Loss</label>
          <input
            type="text"
            name="bloodLoss"
            placeholder="mls"
            value={formdata.bloodLoss ? formdata.bloodLoss : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 col-lg-6">
          <label>Intra-Op Antibiotics</label>
          <input
            type="text"
            name="intraOpAntibiotics"
            value={
              formdata.intraOpAntibiotics ? formdata.intraOpAntibiotics : ''
            }
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </FormGroup>
      <FormGroup row>
        <div className="col-md-6 col-lg-6">
          <label>Procedure Note</label>
          <textarea
            type="text"
            name="procedureNotes"
            placeholder="Write what was done Intra-Op here"
            cols="50"
            value={formdata.procedureNotes ? formdata.procedureNotes : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="col-md-6 col-lg-6">
          <label>Intra-Op Findings</label>
          <textarea
            type="text"
            name="intraOpFindings"
            placeholder="Write the Intra-Op findings"
            value={formdata.intraOpFindings ? formdata.intraOpFindings : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </FormGroup>
      <FormGroup row>
        <div className="col-md-6 col-lg-6">
          <label>Remarks</label>
          <input
            type="text"
            name="remarks"
            // autoComplete={false}
            // autoSave={false}
            autoCorrect={false}
            placeholder="What is the surgery outcome?"
            value={formdata.remarks ? formdata.remarks : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </FormGroup>
      <FormGroup row>
        <div className="col-md-6 col-lg-6">
          <label>Post-Op Order</label>
          <textarea
            type="text"
            name="postOpOrder"
            value={formdata.postOpOrder ? formdata.postOpOrder : ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
      </FormGroup>
      {/* {JSON.stringify(formdata.prescriptionRequestList)}xx */}
      <NewPrescriptionRequest
        patientInfo={patientInfo}
        prescriptionList={formdata.prescriptionRequestList}
        emptyPrescription={emptyPrescription}
        handleConsultationChange={handlePrescriptionChange}
        defaultOpen={true}
      />

      <div className="mt-2">
        <h5>Histology Request</h5>
        <FormGroup row>
          <div className="col-md-6 col-lg-6">
            <label>Histopathology Request</label>
            <textarea
              type="text"
              name="pathologyRequest"
              placeholder="Write Investigation required (e.g. Specimen 1, disk material)"
              value={formdata.pathologyRequest ? formdata.pathologyRequest : ''}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
        </FormGroup>
      </div>
    </>
  )
}

export default OperationNoteForm
