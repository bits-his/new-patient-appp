import React from "react";
import { Card, Col, FormGroup, Label, Row } from "reactstrap";
// import SusceptibilityTest from "../MicroBiology/SusceptibilityTest";
import SpeechInput from "../../../comp/speech-to-text/SpeechInput";

function MacroscopyResultForm({
  item = {},
  isEditting = true,
  handleOthersChange = (f) => f,
}) {
  // const showAppearance = !isBlood;
  const showAppearance = true;
  // const showSerology = !isBlood;
  // const showSerology = false;
  // const showCulture = false;
  // const showSensitivity = false;
  // const showResistivity = false;

  return (
    <Card className="border border-dark my-1 p-2">
      <div>
        <span className="d-block font-weight-bold">
          Investigation: {item.description}
        </span>
        <span className="d-block">Specimen: {item.specimen}</span>
      </div>
      <Row className="">
        <Col md={12}>
          {showAppearance ? (
            <FormGroup>
              {/* <h6>Appearance/Macroscopy:</h6> */}
              <Label className="font-weight-bold">Appearance/Macroscopy:</Label>
              {isEditting ? (
                <SpeechInput
                  // onInputChange={(text) => this.setState({ appearanceM: text })}
                  onInputChange={(text) =>
                    handleOthersChange({ ...item, appearance: text })
                  }
                  tag="textarea"
                  value={item.appearance}
                  style={{ height: "100px" }}
                />
              ) : (
                <p>{item.appearance}</p>
              )}
            </FormGroup>
          ) : null}
         
        </Col>
        <Col md={12}>
          
          <FormGroup>
            {isEditting ? (
              <SpeechInput
                // onInputChange={(text) => this.setState({ appearanceM: text })}
                onInputChange={(text) =>
                  handleOthersChange({ ...item, serology: text })
                }
                tag="textarea"
                value={item.serology}
                style={{ height: "100px" }}
              />
            ) : (
              <p>{item.serology}</p>
            )}
          </FormGroup>
        </Col>
      </Row>
    </Card>
  );
}

export default MacroscopyResultForm;
