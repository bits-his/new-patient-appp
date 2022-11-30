import React from "react";
import { Col, FormGroup, Label, Row } from "reactstrap";
import SpeechInput from "../../../comp/speech-to-text/SpeechInput";
// import BackButton from "../../../comp/components/BackButton";

function MicrobiologyResultForm({ setForm = (f) => f, form = {} }) {
  return (
    <Row>
      <Col md={6}>
        <FormGroup>
          <Label>Appearance/Macroscopy</Label>
          <SpeechInput
            // onInputChange={(text) => this.setState({ appearanceM: text })}
            onInputChange={(text) => setForm("appearanceM", text)}
            tag="textarea"
            value={form.appearanceM}
            style={{ height: "150px" }}
          />
        </FormGroup>

        <FormGroup>
          <Label>Microscopy</Label>

          <SpeechInput
            // onInputChange={(text) => this.setState({ microscopyS: text })}
            onInputChange={(text) => setForm("microscopyS", text)}
            tag="textarea"
            value={form.microscopyS}
            style={{ height: "150px" }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Culture yielded</Label>

          <SpeechInput
            onInputChange={(text) => setForm("cultureY", text)}
            tag="textarea"
            value={form.cultureY}
            style={{ height: "120px" }}
          />
        </FormGroup>
      </Col>

      <Col md={6}>
        <h6>Susceptibility Test</h6>
        <FormGroup>
          <Label>Sensitivity</Label>

          <SpeechInput
            onInputChange={(text) => setForm("sensitivity", text)}
            tag="textarea"
            value={form.sensitivity}
            style={{ height: "120px" }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Resistivity</Label>

          <SpeechInput
            onInputChange={(text) => setForm("resistivity", text)}
            tag="textarea"
            value={form.resistivity}
            style={{ height: "120px" }}
          />
        </FormGroup>

        {/* <SusceptibilityTest
                sensitivities={sensitivities}
                // sensitivityList={sensitivityList}
                // handleSensitivityChange={handleSensitivityChange}
              /> */}

        {/* <LabComments comments={comments} /> */}
        {/* <div className="">
                <label>Add Comment</label>
                <SpeechInput
                  onInputChange={(text) =>
                    setForm('comment', text))
                  }
                  tag="textarea"
                  value={form.comment}
                  style={{ height: '80px' }}
                />
              </div> */}
      </Col>
    </Row>
  );
}

export default MicrobiologyResultForm;
