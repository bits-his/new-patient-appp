import React, { useState } from "react";
import { Col, Row, Form, Label, Input } from "reactstrap";
import SelectInput from "../../comp/components/SelectInput";
import { Typeahead } from "react-bootstrap-typeahead";
import Dropzone from "react-dropzone-uploader";
import { Switch } from "evergreen-ui";
import SpeechInput from "../../comp/speech-to-text/SpeechInput";
import InputGroup from "../../comp/components/InputGroup";
import Checkbox from "../../comp/components/Checkbox";

export default function BasicInfo({
  walkinAcc,
  accounts = [],
  patientInfo = {},
  handleChange = (f) => f,
  handleAccChange = (f) => f,
  setRegType = (f) => f,
  existingPatientId,
  setImages,
  handleHistoryChange = (f) => f,
  labNoMode = "read",
  textInput= "show"
}) {
  // const [regType, setRegType] = useState('Walk-In');
  const [preview, setPreview] = useState(false);
  const handeSubmit = (e) => {
    setPreview(!preview);
  };
  return (
    <Form>
      <Row>
        {existingPatientId ? null : (
          <div className="d-flex justify-content-between form-group col-xs-12 col-sm-12 col-md-12 col-lg-12 p-0">
            <div className="col-md-4 px-0 mx-0">
              <Label>Account Type</Label>
              <Input
                type="select"
                className="form-control"
                value={patientInfo.accountType}
                onChange={({ target }) => setRegType(target.value)}
              >
                <option value="Walk-In">Walk-In</option>
                <option value="Single">Single</option>
                <option value="Family">Family</option>
                <option value="Cooperate">Cooperate</option>
                <option value="Retainership">Retainership</option>
                {/* <option value="Donor">Donor</option> */}
                {/* <option value="Organization">Organization </option>
                <option value="Organization Donor">Organization Donor</option>
                <option value="Credit Organization">Credit Organization</option> */}
              </Input>
            </div>
            {patientInfo.accountType === "Walk-In" ? null : (
              <>
                <Col md={4}>
                  <Label for="name">Account Name</Label>
                  <Typeahead
                    allowNew
                    align="justify"
                    labelKey="accName"
                    id="acctName"
                    options={accounts}
                    onChange={(val) => {
                      if (val.length) handleAccChange(val[0]);
                    }}
                    // onInputChange={name => handleAccChange(name)}
                  />
                </Col>

                <Col md={4}>
                  <Label for="name">Client Acc. No.</Label>
                  <p className="form-control">{patientInfo.clientAccount}</p>
                  {/* <Typeahead
                  allowNew
                  align="justify"
                  // labelKey="acctNo"
                  id="acctNo"
                  options={[2345678, 345464656, 2345673]}
                  // onChange={(val) => {
                  //   if (val.length) handleAccChange(val[0]);
                  // }}
                  // onInputChange={name => handleAccChange(name)}
                /> */}
                </Col>
              </>
            )}
          </div>
        )}
        {/* <Col md={4}>
          <FormGroup>
            <Label for="name">Patient No</Label>
            <Input
              type="text"
              name="patientNo"
              value={patientInfo.patientNo}
              onChange={handleChange}
            />
          </FormGroup>
        </Col> */}
        {/* <Col md={4}>
          <FormGroup>
            <Label for="name">First Name</Label>
            <Input
              type="text"
              name="first_name"
              value={patientInfo.first_name}
              onChange={handleChange}
            />
          </FormGroup>
        </Col> */}

        <Col md={6} className="my-1 mx-0 px-1">
          <InputGroup
            container="col-12 mx-0 px-0"
            label="Full Name"
            type="text"
            name="name"
            value={patientInfo.name}
            onChange={handleChange}
          />
        </Col>

        <Col md={6} className="my-1 mx-0 px-0">
          <Label for="name" className="font-weight-bold">
            Age
          </Label>
          <div className="d-flex flex-direction-row align-items-center justify-content-between">
            <Input
              type="text"
              name="ageD"
              value={patientInfo.ageD}
              onChange={handleChange}
            />
            <span className="mx-1">D</span>

            <Input
              type="text"
              name="ageM"
              value={patientInfo.ageM}
              onChange={handleChange}
            />
            <span className="mx-1">M</span>
            <Input
              type="text"
              name="ageY"
              value={patientInfo.ageY}
              onChange={handleChange}
            />
            <span className="mx-1">Y</span>
          </div>
        </Col>
        <Col md={6} className="my-1 mx-0 px-1">
          <SelectInput
            label="Gender"
            container="col-md-12 col-lg-12 m-0 p-0"
            options={["Male", "Female", "Other"]}
            name="gender"
            value={patientInfo.gender}
            onChange={handleChange}
          />
        </Col>

        <Col md={6} className="my-1 mx-0 px-0">
          <InputGroup
            container="col-12 mx-0 px-0"
            label="Email"
            type="text"
            name="email"
            value={patientInfo.email}
            onChange={handleChange}
          />
        </Col>
        <Col md={6} className="my-1 mx-0 px-1">
          <InputGroup
            container="col-12 mx-0 px-0"
            label="Phone"
            type="text"
            name="phone"
            value={patientInfo.phone}
            onChange={handleChange}
          />
        </Col>

        {/* <Col md={6} className="my-1">
          <FormGroup>
            <Label for="name">Diagnosis</Label>
            <Input
              type="text"
              name="diagnosis"
              value={patientInfo.diagnosis}
              onChange={handleChange}
            />
          </FormGroup>
        </Col> */}
        {textInput === 'show' &&<>
        <Col md={6} className="my-1 mx-0 px-0">
          <SelectInput
            label="Mode of Payment"
            name="modeOfPayment"
            container="col-12 m-0 p-0"
            value={patientInfo.modeOfPayment}
            options={["Cash", "Bank Transfer", "POS"]}
            onChange={handleChange}
          />
        </Col>
        <Col md={12} className='mx-0 px-0 my-1'>
          <label className="font-weight-bold">Clinical History</label>
          <SpeechInput
            value={patientInfo.history}
            onInputChange={(text) => handleHistoryChange(text)}
            tag="textarea"
          />
          {/* {JSON.stringify(patientInfo)} */}
        </Col>
        <Col md={12} className='mx-0 px-0 my-1'>
          <div>
          <Checkbox label='Send result to mail?' checked={true} />
          </div>
        </Col>
        <Col md={12} className='mx-0 px-0 my-1'>
          <div>
            <Label className="font-weight-bold">Scan request form?</Label>
            <Switch height={24} checked={preview} onChange={handeSubmit} />
          </div>
        </Col></>
}
        {preview ? (
          <Col md={12}>
            <Label className="font-weight-bold">Upload Images</Label>

            <Dropzone
              // getUploadParams={getUploadParams}
              onChangeStatus={({ file }, status) => {
                if (status === "done") {
                  setImages((p) => [...p, file]);
                }
              }}
              accept="image/*,audio/*,video/*"
              addClassNames="text-success"
              SubmitButtonComponent={null}
              styles={{
                dropzone: {
                  height: 100,
                  // marginTop: '10px',
                },
              }}
            />
          </Col>
        ) : null}
      </Row>
      {/* <center>
        <Button color="primary" onClick={handleSubmit}>
          Save
        </Button>
      </center> */}
    </Form>
  );
}
